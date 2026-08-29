import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { loginSchema } from "@/lib/validators";
import { verifyPassword } from "@/lib/password";
import { createSession, dashboardPath } from "@/lib/auth";
import { logSecurityEvent } from "@/lib/security-log";
import { assertLoginAllowed } from "@/lib/rate-limit";
import { getClientInfo, safeRedirectPath } from "@/lib/utils";
import { apiError } from "@/lib/api";
import { isPrismaConnectionError, withPrismaConnectionRetry } from "@/lib/database-health";
import { createMfaChallengeToken, hashMfaChallengeToken } from "@/lib/totp";

export async function POST(request: Request) {
  let email = "unknown";
  try {
    const input = loginSchema.parse(await request.json());
    email = input.email;
    const { ipAddress } = getClientInfo(request);
    await assertLoginAllowed(ipAddress);
    const user = await withPrismaConnectionRetry(() => db.user.findUnique({ where: { email: input.email }, select: { id: true, email: true, passwordHash: true, role: true, isActive: true, totpEnabled: true, totpSecretEncrypted: true } }));
    if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
      await logSecurityEvent({ request, userId: user?.id, action: "LOGIN_PASSWORD", status: "FAILURE", metadata: { email } });
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }
    if (!user.isActive) {
      await logSecurityEvent({ request, userId: user.id, action: "LOGIN_PASSWORD", status: "FAILURE", metadata: { reason: "disabled" } });
      return NextResponse.json({ error: "This account has been disabled by an administrator." }, { status: 403 });
    }
    const defaultPath = dashboardPath(user.role);
    const requestedPath = safeRedirectPath(input.redirectTo, defaultPath);
    const redirectTo = requestedPath === "/dashboard" ? defaultPath : requestedPath;
    if (user.totpEnabled) {
      if (!user.totpSecretEncrypted) {
        await logSecurityEvent({ request, userId: user.id, action: "LOGIN_MFA", status: "FAILURE", metadata: { reason: "missing_secret" } });
        return NextResponse.json({ error: "Authenticator verification is temporarily unavailable for this account." }, { status: 503 });
      }
      const challengeToken = createMfaChallengeToken();
      await db.$transaction([
        db.mfaLoginChallenge.deleteMany({ where: { OR: [{ userId: user.id }, { expiresAt: { lt: new Date() } }] } }),
        db.mfaLoginChallenge.create({
          data: {
            userId: user.id,
            tokenHash: hashMfaChallengeToken(challengeToken),
            redirectTo,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
          }
        })
      ]);
      await logSecurityEvent({ request, userId: user.id, action: "LOGIN_PASSWORD", status: "SUCCESS", metadata: { mfaRequired: true } });
      return NextResponse.json({ success: true, mfaRequired: true, challengeToken });
    }
    await createSession(user.id);
    await logSecurityEvent({ request, userId: user.id, action: "LOGIN_PASSWORD", status: "SUCCESS", metadata: { mfaRequired: false } });
    return NextResponse.json({ success: true, redirectTo });
  } catch (error) {
    await logSecurityEvent({ request, action: "LOGIN_PASSWORD", status: "FAILURE", metadata: { email } });
    const rateLimited = error instanceof Error && error.message.includes("Too many failed login attempts");
    const databaseUnavailable = isPrismaConnectionError(error);
    return apiError(
      error,
      rateLimited ? error.message : databaseUnavailable ? "Login service is temporarily unavailable. Please try again in a moment." : "Login failed",
      rateLimited ? 429 : databaseUnavailable ? 503 : 400
    );
  }
}
