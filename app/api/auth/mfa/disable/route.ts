import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { mfaCodeSchema } from "@/lib/validators";
import { verifyTotp } from "@/lib/mfa";
import { logSecurityEvent } from "@/lib/security-log";
import { apiError } from "@/lib/api";

// Turns two-factor authentication off. A valid current code is required so a
// borrowed, already-signed-in session cannot silently weaken the account.
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    const { code } = mfaCodeSchema.parse(await request.json());

    const record = await db.user.findUnique({ where: { id: user.id }, select: { totpSecret: true, totpEnabled: true } });
    if (!record?.totpEnabled || !record.totpSecret) return NextResponse.json({ error: "Two-factor authentication is not enabled." }, { status: 400 });
    if (!verifyTotp(record.totpSecret, code)) {
      return NextResponse.json({ error: "That code didn't match. Check your authenticator app and try again." }, { status: 400 });
    }

    await db.user.update({ where: { id: user.id }, data: { totpSecret: null, totpEnabled: false } });
    await logSecurityEvent({ request, userId: user.id, action: "MFA_DISABLE", status: "WARNING" });
    return NextResponse.json({ success: true });
  } catch (error) { return apiError(error, "Could not disable two-factor authentication"); }
}
