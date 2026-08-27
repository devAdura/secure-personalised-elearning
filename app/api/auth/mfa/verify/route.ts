import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { mfaVerifySchema } from "@/lib/validators";
import { createSession, dashboardPath } from "@/lib/auth";
import { verifyMfaTicket, verifyTotp } from "@/lib/mfa";
import { logSecurityEvent } from "@/lib/security-log";
import { assertLoginAllowed } from "@/lib/rate-limit";
import { getClientInfo, safeRedirectPath } from "@/lib/utils";
import { apiError } from "@/lib/api";
import { isPrismaConnectionError, withPrismaConnectionRetry } from "@/lib/database-health";

// Second step of two-factor login: exchange a short-lived ticket + authenticator
// code for a session. The ticket proves the password step already succeeded.
export async function POST(request: Request) {
  try {
    const input = mfaVerifySchema.parse(await request.json());
    const { ipAddress } = getClientInfo(request);
    await assertLoginAllowed(ipAddress, ["LOGIN_MFA"]);

    const userId = verifyMfaTicket(input.ticket);
    if (!userId) return NextResponse.json({ error: "Your login session expired. Please sign in again." }, { status: 401 });

    const user = await withPrismaConnectionRetry(() => db.user.findUnique({ where: { id: userId } }));
    if (!user || !user.isActive || !user.totpEnabled || !user.totpSecret) {
      return NextResponse.json({ error: "Your login session expired. Please sign in again." }, { status: 401 });
    }
    if (!verifyTotp(user.totpSecret, input.code)) {
      await logSecurityEvent({ request, userId: user.id, action: "LOGIN_MFA", status: "FAILURE" });
      return NextResponse.json({ error: "That code didn't match. Check your authenticator app and try again." }, { status: 401 });
    }

    await createSession(user.id);
    await logSecurityEvent({ request, userId: user.id, action: "LOGIN_MFA", status: "SUCCESS" });
    const defaultPath = dashboardPath(user.role);
    const requested = safeRedirectPath(input.redirectTo, defaultPath);
    return NextResponse.json({ success: true, redirectTo: requested === "/dashboard" ? defaultPath : requested });
  } catch (error) {
    const rateLimited = error instanceof Error && error.message.includes("Too many failed login attempts");
    const databaseUnavailable = isPrismaConnectionError(error);
    return apiError(
      error,
      rateLimited ? error.message : databaseUnavailable ? "Login service is temporarily unavailable. Please try again in a moment." : "Verification failed",
      rateLimited ? 429 : databaseUnavailable ? 503 : 400
    );
  }
}
