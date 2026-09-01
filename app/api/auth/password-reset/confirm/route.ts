import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apiError } from "@/lib/api";
import { hashPassword } from "@/lib/password";
import { logSecurityEvent } from "@/lib/security-log";
import { passwordResetConfirmSchema } from "@/lib/validators";
import {
  hashPasswordResetToken,
  PASSWORD_RESET_MAX_ATTEMPTS,
  verifyPasswordResetCode
} from "@/lib/password-reset";

export const runtime = "nodejs";

const INVALID_CODE_MESSAGE = "That reset code is invalid or has expired. Request a new code and try again.";

export async function POST(request: Request) {
  try {
    const input = passwordResetConfirmSchema.parse(await request.json());
    const challenge = await db.passwordResetChallenge.findUnique({
      where: { tokenHash: hashPasswordResetToken(input.challengeToken) },
      include: { user: { select: { id: true, email: true, isActive: true } } }
    });

    if (
      !challenge ||
      challenge.user.email !== input.email ||
      !challenge.user.isActive ||
      challenge.consumedAt ||
      challenge.expiresAt <= new Date() ||
      challenge.attempts >= PASSWORD_RESET_MAX_ATTEMPTS
    ) {
      await logSecurityEvent({ request, userId: challenge?.userId, action: "PASSWORD_RESET_FAILED", status: "FAILURE" });
      return NextResponse.json({ error: INVALID_CODE_MESSAGE }, { status: 400 });
    }

    const attempt = await db.passwordResetChallenge.updateMany({
      where: {
        id: challenge.id,
        attempts: { lt: PASSWORD_RESET_MAX_ATTEMPTS },
        consumedAt: null,
        expiresAt: { gt: new Date() }
      },
      data: { attempts: { increment: 1 } }
    });
    if (attempt.count !== 1) {
      return NextResponse.json({ error: INVALID_CODE_MESSAGE }, { status: 400 });
    }

    const codeIsValid = await verifyPasswordResetCode(input.code, challenge.codeHash);
    if (!codeIsValid) {
      await logSecurityEvent({ request, userId: challenge.userId, action: "PASSWORD_RESET_FAILED", status: "FAILURE" });
      return NextResponse.json({ error: INVALID_CODE_MESSAGE }, { status: 400 });
    }

    const passwordHash = await hashPassword(input.password);
    await db.$transaction([
      db.user.update({ where: { id: challenge.userId }, data: { passwordHash } }),
      db.session.deleteMany({ where: { userId: challenge.userId } }),
      db.mfaLoginChallenge.deleteMany({ where: { userId: challenge.userId } }),
      db.passwordResetChallenge.update({ where: { id: challenge.id }, data: { consumedAt: new Date() } }),
      db.passwordResetChallenge.deleteMany({ where: { userId: challenge.userId, id: { not: challenge.id } } })
    ]);

    await logSecurityEvent({ request, userId: challenge.userId, action: "PASSWORD_RESET_COMPLETED", status: "SUCCESS" });
    return NextResponse.json({ success: true, message: "Your password has been changed. You can now sign in." });
  } catch (error) {
    return apiError(error, "Password could not be reset");
  }
}
