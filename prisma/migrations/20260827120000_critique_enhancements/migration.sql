-- Critique enhancements: late-submission flag, profile photo, TOTP MFA.

-- Late assignment submissions are recorded and surfaced as "Late".
ALTER TABLE "Submission" ADD COLUMN "isLate" BOOLEAN NOT NULL DEFAULT false;

-- Optional profile photo, stored as a small image data URL (free-first, no external image host).
ALTER TABLE "User" ADD COLUMN "avatarUrl" TEXT;

-- Multi-factor authentication (TOTP / authenticator app).
ALTER TABLE "User" ADD COLUMN "totpSecret" TEXT;
ALTER TABLE "User" ADD COLUMN "totpEnabled" BOOLEAN NOT NULL DEFAULT false;
