import { NextResponse } from "next/server";
import { generateRegistrationOptions, type AuthenticatorTransportFuture } from "@simplewebauthn/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { challengeLifetimeMs, rpID, rpName } from "@/lib/webauthn";

export const runtime = "nodejs";

export async function POST() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const credentials = await db.webAuthnCredential.findMany({ where: { userId: user.id } });
  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userName: user.email,
    userDisplayName: user.name,
    userID: new Uint8Array(Buffer.from(user.id, "utf8")),
    attestationType: "none",
    supportedAlgorithmIDs: [-7, -257],
    excludeCredentials: credentials.map((credential) => ({
      id: credential.credentialID,
      transports: credential.transports as AuthenticatorTransportFuture[]
    })),
    authenticatorSelection: {
      residentKey: "required",
      userVerification: "required"
    },
    preferredAuthenticatorType: "localDevice"
  });
  await db.webAuthnChallenge.deleteMany({ where: { userId: user.id, type: "REGISTRATION" } });
  await db.webAuthnChallenge.create({ data: { userId: user.id, challenge: options.challenge, type: "REGISTRATION", expiresAt: new Date(Date.now() + challengeLifetimeMs) } });
  return NextResponse.json(options);
}
