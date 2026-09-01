import crypto from "node:crypto";
import bcrypt from "bcryptjs";

export const PASSWORD_RESET_TTL_MINUTES = 10;
export const PASSWORD_RESET_MAX_ATTEMPTS = 5;

export function createPasswordResetCode() {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export function createPasswordResetToken() {
  return crypto.randomBytes(32).toString("base64url");
}

export function hashPasswordResetToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function hashPasswordResetCode(code: string) {
  return bcrypt.hash(code, 12);
}

export function verifyPasswordResetCode(code: string, hash: string) {
  return bcrypt.compare(code, hash);
}
