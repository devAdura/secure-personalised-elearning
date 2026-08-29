import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { mfaCodeSchema } from "@/lib/validators";
import { apiError } from "@/lib/api";
import { logSecurityEvent } from "@/lib/security-log";
import { decryptTotpSecret, verifyTotp } from "@/lib/totp";

export const runtime = "nodejs";

export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  try {
    const code = mfaCodeSchema.parse((await request.json()).code);
    const account = await db.user.findUnique({ where: { id: user.id }, select: { totpEnabled: true, totpSecretEncrypted: true } });
    if (!account?.totpEnabled || !account.totpSecretEncrypted) throw new Error("Authenticator MFA is not enabled.");
    if (!verifyTotp(decryptTotpSecret(account.totpSecretEncrypted), code)) {
      return NextResponse.json({ error: "That code is not valid. MFA was not disabled." }, { status: 400 });
    }
    await db.$transaction([
      db.mfaLoginChallenge.deleteMany({ where: { userId: user.id } }),
      db.user.update({ where: { id: user.id }, data: { totpEnabled: false, totpSecretEncrypted: null } })
    ]);
    await logSecurityEvent({ request, userId: user.id, action: "MFA_DISABLED", status: "WARNING" });
    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError(error, "Authenticator MFA could not be disabled");
  }
}
