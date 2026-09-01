import crypto from "node:crypto";

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const TOTP_DIGITS = 6;
const TOTP_PERIOD_SECONDS = 30;

function base32Encode(value: Buffer) {
  let bits = 0;
  let bitCount = 0;
  let output = "";

  for (const byte of value) {
    bits = (bits << 8) | byte;
    bitCount += 8;
    while (bitCount >= 5) {
      output += BASE32_ALPHABET[(bits >>> (bitCount - 5)) & 31];
      bitCount -= 5;
    }
  }

  if (bitCount > 0) output += BASE32_ALPHABET[(bits << (5 - bitCount)) & 31];
  return output;
}

function base32Decode(value: string) {
  const normalized = value.toUpperCase().replace(/=+$/g, "").replace(/\s+/g, "");
  let bits = 0;
  let bitCount = 0;
  const output: number[] = [];

  for (const character of normalized) {
    const index = BASE32_ALPHABET.indexOf(character);
    if (index < 0) throw new Error("Authenticator secret is invalid.");
    bits = (bits << 5) | index;
    bitCount += 5;
    if (bitCount >= 8) {
      output.push((bits >>> (bitCount - 8)) & 255);
      bitCount -= 8;
    }
  }

  return Buffer.from(output);
}

function getEncryptionKey() {
  const configured = process.env.MFA_ENCRYPTION_KEY?.trim();
  if (!configured && process.env.NODE_ENV === "production") {
    throw new Error("Authenticator MFA is not configured on this deployment.");
  }
  return crypto.createHash("sha256").update(configured || "securelearn-local-development-mfa-key").digest();
}

export function isMfaEncryptionConfigured() {
  return Boolean(process.env.MFA_ENCRYPTION_KEY?.trim());
}

export function createTotpSecret() {
  return base32Encode(crypto.randomBytes(20));
}

export function createTotpUri(secret: string, email: string) {
  const issuer = "SecureLearn";
  const label = encodeURIComponent(`${issuer}:${email}`);
  return `otpauth://totp/${label}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=${TOTP_DIGITS}&period=${TOTP_PERIOD_SECONDS}`;
}

export function generateTotp(secret: string, timestamp = Date.now()) {
  const counter = Math.floor(timestamp / 1000 / TOTP_PERIOD_SECONDS);
  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeBigUInt64BE(BigInt(counter));
  const digest = crypto.createHmac("sha1", base32Decode(secret)).update(counterBuffer).digest();
  const offset = digest[digest.length - 1] & 0x0f;
  const binary = (digest.readUInt32BE(offset) & 0x7fffffff) % (10 ** TOTP_DIGITS);
  return binary.toString().padStart(TOTP_DIGITS, "0");
}

export function verifyTotp(secret: string, token: string, timestamp = Date.now()) {
  if (!/^\d{6}$/.test(token)) return false;
  const candidate = Buffer.from(token);
  for (let window = -1; window <= 1; window += 1) {
    const expected = Buffer.from(generateTotp(secret, timestamp + window * TOTP_PERIOD_SECONDS * 1000));
    if (candidate.length === expected.length && crypto.timingSafeEqual(candidate, expected)) return true;
  }
  return false;
}

export function encryptTotpSecret(secret: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(secret, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return ["v1", iv.toString("base64url"), tag.toString("base64url"), encrypted.toString("base64url")].join(".");
}

export function decryptTotpSecret(value: string) {
  const [version, ivValue, tagValue, encryptedValue] = value.split(".");
  if (version !== "v1" || !ivValue || !tagValue || !encryptedValue) throw new Error("Authenticator secret is invalid.");
  const decipher = crypto.createDecipheriv("aes-256-gcm", getEncryptionKey(), Buffer.from(ivValue, "base64url"));
  decipher.setAuthTag(Buffer.from(tagValue, "base64url"));
  return Buffer.concat([decipher.update(Buffer.from(encryptedValue, "base64url")), decipher.final()]).toString("utf8");
}

export function createMfaChallengeToken() {
  return crypto.randomBytes(32).toString("base64url");
}

export function hashMfaChallengeToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
