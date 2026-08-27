import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { generateTotpSecret, totpAuthUrl } from "@/lib/mfa";
import { apiError } from "@/lib/api";

// Begins authenticator-app enrolment: generates a fresh secret, stores it
// (still disabled until the user confirms a code), and returns the QR code and
// manual key for the user to add to their app.
export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    if (user.totpEnabled) return NextResponse.json({ error: "Two-factor authentication is already enabled." }, { status: 400 });

    const secret = generateTotpSecret();
    await db.user.update({ where: { id: user.id }, data: { totpSecret: secret, totpEnabled: false } });
    const otpauthUrl = totpAuthUrl(secret, user.email);
    const qr = await QRCode.toDataURL(otpauthUrl);
    return NextResponse.json({ secret, otpauthUrl, qr });
  } catch (error) { return apiError(error, "Could not start two-factor setup"); }
}
