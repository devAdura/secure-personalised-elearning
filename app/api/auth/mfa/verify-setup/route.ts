import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { mfaCodeSchema } from "@/lib/validators";
import { apiError } from "@/lib/api";
import { logSecurityEvent } from "@/lib/security-log";
import { decryptTotpSecret, verifyTotp } from "@/lib/totp";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  try {
    const code = mfaCodeSchema.parse((await request.json()).code);
    const account = await db.user.findUnique({ where: { id: user.id }, select: { totpSecretEncrypted: true } });
    if (!account?.totpSecretEncrypted) throw new Error("Start authenticator setup before verifying a code.");
    if (!verifyTotp(decryptTotpSecret(account.totpSecretEncrypted), code)) {
      await logSecurityEvent({ request, userId: user.id, action: "MFA_SETUP_VERIFY", status: "FAILURE" });
      return NextResponse.json({ error: "That code is not valid. Wait for a fresh code and try again." }, { status: 400 });
    }
    await db.user.update({ where: { id: user.id }, data: { totpEnabled: true } });
    await logSecurityEvent({ request, userId: user.id, action: "MFA_ENABLED", status: "SUCCESS" });
    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError(error, "Authenticator verification failed");
  }
}
