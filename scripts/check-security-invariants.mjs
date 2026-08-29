import fs from "node:fs";

const schema = fs.readFileSync("prisma/schema.prisma", "utf8");
const forbiddenSchemaTerms = ["fingerprintImage", "fingerprintTemplate", "biometricData", "biometricTemplate"];
for (const term of forbiddenSchemaTerms) {
  if (schema.toLowerCase().includes(term.toLowerCase())) {
    console.error(`Forbidden biometric-storage field detected: ${term}`);
    process.exit(1);
  }
}

const auth = fs.readFileSync("lib/auth.ts", "utf8");
for (const required of ["httpOnly: true", "sameSite: \"lax\"", "tokenHash", "randomBytes(32)"]) {
  if (!auth.includes(required)) {
    console.error(`Missing session security invariant: ${required}`);
    process.exit(1);
  }
}

// The TOTP secret must never leave the server via the shared getCurrentUser read.
if (auth.includes("totpSecretEncrypted")) {
  console.error("Missing MFA invariant: getCurrentUser must not select totpSecretEncrypted");
  process.exit(1);
}

// TOTP secrets are encrypted at rest and login challenges are compared in constant time.
const mfa = fs.readFileSync("lib/totp.ts", "utf8");
for (const required of ["createCipheriv", "createDecipheriv", "timingSafeEqual", "hashMfaChallengeToken"]) {
  if (!mfa.includes(required)) {
    console.error(`Missing MFA invariant: ${required}`);
    process.exit(1);
  }
}

const webauthn = [
  fs.readFileSync("app/api/auth/passkey/register-options/route.ts", "utf8"),
  fs.readFileSync("app/api/auth/passkey/register-verify/route.ts", "utf8"),
  fs.readFileSync("app/api/auth/passkey/authentication-verify/route.ts", "utf8")
].join("\n");
for (const required of ["userVerification: \"required\"", "requireUserVerification: true", "expectedChallenge", "expectedOrigin", "expectedRPID"]) {
  if (!webauthn.includes(required)) {
    console.error(`Missing WebAuthn invariant: ${required}`);
    process.exit(1);
  }
}

console.log("Security invariant checks passed.");
