import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { apiError } from "@/lib/api";
import { logSecurityEvent } from "@/lib/security-log";
import { createTotpSecret, createTotpUri, encryptTotpSecret } from "@/lib/totp";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  if (user.totpEnabled) return NextResponse.json({ error: "Disable the current authenticator before enrolling a replacement." }, { status: 409 });
  try {
    const secret = createTotpSecret();
    const uri = createTotpUri(secret, user.email);
    const qrCodeDataUrl = await QRCode.toDataURL(uri, { width: 260, margin: 1, errorCorrectionLevel: "M" });
    await db.user.update({
      where: { id: user.id },
      data: { totpSecretEncrypted: encryptTotpSecret(secret), totpEnabled: false }
    });
    await logSecurityEvent({ request, userId: user.id, action: "MFA_SETUP_STARTED", status: "SUCCESS" });
    return NextResponse.json({ secret, qrCodeDataUrl });
  } catch (error) {
    return apiError(error, "Authenticator setup could not be started", 503);
  }
}
