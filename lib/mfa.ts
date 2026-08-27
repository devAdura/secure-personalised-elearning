import crypto from "node:crypto";
import * as OTPAuth from "otpauth";

// Multi-factor authentication (TOTP). SecureLearn already supports passwords and
// device passkeys; this adds standard authenticator-app codes (Google
// Authenticator, Authy, 1Password, etc.) as a second factor after the password.

const ISSUER = "SecureLearn";
const TICKET_TTL_MS = 5 * 60 * 1000; // window to enter the code after the password step

// Signing key for the stateless login ticket. Prefer an explicit AUTH_SECRET;
// otherwise derive a stable key from DATABASE_URL so deployments work without
// extra configuration. The ticket only proves "this user just passed the
// password step" — it is never a session and expires in minutes.
function ticketKey() {
  return process.env.AUTH_SECRET || crypto.createHash("sha256").update(process.env.DATABASE_URL || "securelearn-mfa-fallback").digest("hex");
}

function buildTotp(secret: string, label: string) {
  return new OTPAuth.TOTP({ issuer: ISSUER, label, algorithm: "SHA1", digits: 6, period: 30, secret: OTPAuth.Secret.fromBase32(secret) });
}

export function generateTotpSecret() {
  return new OTPAuth.Secret({ size: 20 }).base32;
}

export function totpAuthUrl(secret: string, accountLabel: string) {
  return buildTotp(secret, accountLabel).toString();
}

export function verifyTotp(secret: string, token: string) {
  // window: 1 tolerates one 30s step of clock drift on either side.
  return buildTotp(secret, ISSUER).validate({ token, window: 1 }) !== null;
}

// --- Stateless two-step login ticket ------------------------------------------
export function createMfaTicket(userId: string) {
  const payload = `${userId}.${Date.now() + TICKET_TTL_MS}`;
  const sig = crypto.createHmac("sha256", ticketKey()).update(payload).digest("base64url");
  return `${Buffer.from(payload).toString("base64url")}.${sig}`;
}

export function verifyMfaTicket(ticket: string): string | null {
  const [encodedPayload, sig] = ticket.split(".");
  if (!encodedPayload || !sig) return null;
  const payload = Buffer.from(encodedPayload, "base64url").toString();
  const expected = crypto.createHmac("sha256", ticketKey()).update(payload).digest("base64url");
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) return null;
  const [userId, expiresAt] = payload.split(".");
  if (!userId || !expiresAt || Number(expiresAt) < Date.now()) return null;
  return userId;
}
