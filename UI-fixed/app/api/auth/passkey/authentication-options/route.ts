import { NextResponse } from "next/server";
import { generateAuthenticationOptions, type AuthenticatorTransportFuture } from "@simplewebauthn/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { challengeLifetimeMs, rpID } from "@/lib/webauthn";
import { apiError } from "@/lib/api";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { email } = z.object({ email: z.string().email().transform((v) => v.toLowerCase()) }).parse(await request.json());
    const user = await db.user.findUnique({ where: { email }, include: { webAuthnCredentials: true } });
    if (!user || !user.isActive || user.webAuthnCredentials.length === 0) {
      return NextResponse.json({ error: "No active passkey is registered for this account." }, { status: 404 });
    }
    const options = await generateAuthenticationOptions({
      rpID,
      userVerification: "required",
      allowCredentials: user.webAuthnCredentials.map((credential) => ({ id: credential.credentialID, transports: credential.transports as AuthenticatorTransportFuture[] }))
    });
    await db.webAuthnChallenge.deleteMany({ where: { email, type: "AUTHENTICATION" } });
    await db.webAuthnChallenge.create({ data: { email, userId: user.id, challenge: options.challenge, type: "AUTHENTICATION", expiresAt: new Date(Date.now() + challengeLifetimeMs) } });
    return NextResponse.json(options);
  } catch (error) {
    return apiError(error, "Could not start passkey login");
  }
}
