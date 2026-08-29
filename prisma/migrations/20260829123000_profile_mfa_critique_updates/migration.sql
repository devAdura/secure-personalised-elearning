-- AlterTable
ALTER TABLE "User"
ADD COLUMN "avatarDataUrl" TEXT,
ADD COLUMN "totpSecretEncrypted" TEXT,
ADD COLUMN "totpEnabled" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "MfaLoginChallenge" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "redirectTo" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MfaLoginChallenge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MfaLoginChallenge_tokenHash_key" ON "MfaLoginChallenge"("tokenHash");
CREATE INDEX "MfaLoginChallenge_userId_idx" ON "MfaLoginChallenge"("userId");
CREATE INDEX "MfaLoginChallenge_expiresAt_idx" ON "MfaLoginChallenge"("expiresAt");

-- AddForeignKey
ALTER TABLE "MfaLoginChallenge" ADD CONSTRAINT "MfaLoginChallenge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Keep the new table closed to accidental Supabase Data API access.
ALTER TABLE "MfaLoginChallenge" ENABLE ROW LEVEL SECURITY;
