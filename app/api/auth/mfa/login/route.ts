import { NextResponse } from "next/server";
import { z } from "zod";
import { createSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { logSecurityEvent } from "@/lib/security-log";
import { mfaCodeSchema } from "@/lib/validators";
import { decryptTotpSecret, hashMfaChallengeToken, verifyTotp } from "@/lib/totp";

export const runtime = "nodejs";

const inputSchema = z.object({ challengeToken: z.string().min(32).max(200), code: mfaCodeSchema });

export async function POST(request: Request) {
  const parsed = inputSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Enter a valid authenticator code." }, { status: 400 });
  const tokenHash = hashMfaChallengeToken(parsed.data.challengeToken);
  const challenge = await db.mfaLoginChallenge.findUnique({
    where: { tokenHash },
    include: { user: { select: { id: true, isActive: true, totpEnabled: true, totpSecretEncrypted: true } } }
  });

  if (!challenge || challenge.expiresAt <= new Date() || !challenge.user.isActive) {
    if (challenge) await db.mfaLoginChallenge.delete({ where: { id: challenge.id } });
    return NextResponse.json({ error: "This verification request has expired. Sign in again." }, { status: 401 });
  }
  if (!challenge.user.totpEnabled || !challenge.user.totpSecretEncrypted) {
    await db.mfaLoginChallenge.delete({ where: { id: challenge.id } });
    return NextResponse.json({ error: "Authenticator verification is not available for this account." }, { status: 401 });
  }

  const valid = verifyTotp(decryptTotpSecret(challenge.user.totpSecretEncrypted), parsed.data.code);
  if (!valid) {
    const attempts = challenge.attempts + 1;
    if (attempts >= 5) await db.mfaLoginChallenge.delete({ where: { id: challenge.id } });
    else await db.mfaLoginChallenge.update({ where: { id: challenge.id }, data: { attempts } });
    await logSecurityEvent({ request, userId: challenge.user.id, action: "LOGIN_MFA", status: "FAILURE", metadata: { attempts } });
    return NextResponse.json({ error: attempts >= 5 ? "Too many incorrect codes. Sign in again." : "That code is not valid. Try the newest code in your app." }, { status: 401 });
  }

  await db.mfaLoginChallenge.deleteMany({ where: { userId: challenge.user.id } });
  await createSession(challenge.user.id);
  await logSecurityEvent({ request, userId: challenge.user.id, action: "LOGIN_MFA", status: "SUCCESS" });
  return NextResponse.json({ success: true, redirectTo: challenge.redirectTo });
}
