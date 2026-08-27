import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { mfaCodeSchema } from "@/lib/validators";
import { verifyTotp } from "@/lib/mfa";
import { logSecurityEvent } from "@/lib/security-log";
import { apiError } from "@/lib/api";

// Confirms enrolment: the user proves they can generate a valid code before
// two-factor authentication is switched on for their account.
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    const { code } = mfaCodeSchema.parse(await request.json());

    const record = await db.user.findUnique({ where: { id: user.id }, select: { totpSecret: true, totpEnabled: true } });
    if (!record?.totpSecret) return NextResponse.json({ error: "Start two-factor setup first." }, { status: 400 });
    if (record.totpEnabled) return NextResponse.json({ error: "Two-factor authentication is already enabled." }, { status: 400 });
    if (!verifyTotp(record.totpSecret, code)) {
      return NextResponse.json({ error: "That code didn't match. Check your authenticator app and try again." }, { status: 400 });
    }

    await db.user.update({ where: { id: user.id }, data: { totpEnabled: true } });
    await logSecurityEvent({ request, userId: user.id, action: "MFA_ENABLE", status: "SUCCESS" });
    return NextResponse.json({ success: true });
  } catch (error) { return apiError(error, "Could not enable two-factor authentication"); }
}
