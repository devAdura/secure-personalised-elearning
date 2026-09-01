import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apiError } from "@/lib/api";
import { isRecoveryEmailConfigured, sendPasswordResetCode } from "@/lib/email";
import { logSecurityEvent } from "@/lib/security-log";
import { getClientInfo } from "@/lib/utils";
import { passwordResetRequestSchema } from "@/lib/validators";
import {
  createPasswordResetCode,
  createPasswordResetToken,
  hashPasswordResetCode,
  hashPasswordResetToken,
  PASSWORD_RESET_TTL_MINUTES
} from "@/lib/password-reset";

export const runtime = "nodejs";

const MAX_REQUESTS_PER_HOUR = 3;
const ACCEPTED_MESSAGE = "If an active account matches that email, a 6-digit reset code has been sent.";

export async function POST(request: Request) {
  try {
    const { email } = passwordResetRequestSchema.parse(await request.json());
    if (!isRecoveryEmailConfigured()) {
      return NextResponse.json(
        { error: "Password recovery email is temporarily unavailable. Please contact admin@securelearn.test for help." },
        { status: 503 }
      );
    }

    const { ipAddress } = getClientInfo(request);
    const user = await db.user.findUnique({
      where: { email },
      select: { id: true, isActive: true }
    });

    const challengeToken = createPasswordResetToken();
    if (!user?.isActive) {
      await logSecurityEvent({ request, action: "PASSWORD_RESET_REQUESTED", status: "WARNING" });
      return NextResponse.json({ success: true, message: ACCEPTED_MESSAGE, challengeToken });
    }

    const since = new Date(Date.now() - 60 * 60 * 1000);
    const [userRequests, ipRequests] = await Promise.all([
      db.passwordResetChallenge.count({ where: { userId: user.id, createdAt: { gte: since } } }),
      db.passwordResetChallenge.count({ where: { requestedIp: ipAddress, createdAt: { gte: since } } })
    ]);
    if (userRequests >= MAX_REQUESTS_PER_HOUR || ipRequests >= MAX_REQUESTS_PER_HOUR * 4) {
      return NextResponse.json({ error: "Too many reset requests. Please wait before trying again." }, { status: 429 });
    }

    const code = createPasswordResetCode();
    const [codeHash] = await Promise.all([
      hashPasswordResetCode(code),
      db.passwordResetChallenge.deleteMany({
        where: { userId: user.id, OR: [{ consumedAt: { not: null } }, { expiresAt: { lte: new Date() } }] }
      })
    ]);
    const challenge = await db.passwordResetChallenge.create({
      data: {
        userId: user.id,
        tokenHash: hashPasswordResetToken(challengeToken),
        codeHash,
        requestedIp: ipAddress,
        expiresAt: new Date(Date.now() + PASSWORD_RESET_TTL_MINUTES * 60 * 1000)
      }
    });

    try {
      await sendPasswordResetCode(email, code);
    } catch (error) {
      await db.passwordResetChallenge.delete({ where: { id: challenge.id } });
      await logSecurityEvent({ request, userId: user.id, action: "PASSWORD_RESET_EMAIL", status: "FAILURE" });
      console.error("Password reset email delivery failed", error);
      return NextResponse.json(
        { error: "The reset email could not be sent. Please try again shortly or contact admin@securelearn.test." },
        { status: 503 }
      );
    }

    await logSecurityEvent({ request, userId: user.id, action: "PASSWORD_RESET_REQUESTED", status: "SUCCESS" });
    return NextResponse.json({ success: true, message: ACCEPTED_MESSAGE, challengeToken });
  } catch (error) {
    return apiError(error, "Password reset could not be started");
  }
}
