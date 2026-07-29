import { NextResponse } from "next/server";
import { verifyAuthenticationResponse, type AuthenticationResponseJSON, type AuthenticatorTransportFuture } from "@simplewebauthn/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { createSession, dashboardPath } from "@/lib/auth";
import { expectedOrigin, rpID } from "@/lib/webauthn";
import { logSecurityEvent } from "@/lib/security-log";
import { safeRedirectPath } from "@/lib/utils";
import { apiError } from "@/lib/api";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let userId: string | undefined;
  try {
    const body = z.object({ email: z.string().email().transform((v) => v.toLowerCase()), response: z.any(), redirectTo: z.string().optional() }).parse(await request.json());
    const user = await db.user.findUnique({ where: { email: body.email } });
    if (!user || !user.isActive) throw new Error("Account not available.");
    userId = user.id;
    const challenge = await db.webAuthnChallenge.findFirst({ where: { userId: user.id, email: body.email, type: "AUTHENTICATION", expiresAt: { gt: new Date() } }, orderBy: { createdAt: "desc" } });
    if (!challenge) throw new Error("Passkey login session expired. Start again.");
    const response = body.response as AuthenticationResponseJSON;
    const credential = await db.webAuthnCredential.findFirst({ where: { userId: user.id, credentialID: response.id } });
    if (!credential) throw new Error("This passkey is not registered to the account.");
    const verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge: challenge.challenge,
      expectedOrigin,
      expectedRPID: rpID,
      credential: {
        id: credential.credentialID,
        publicKey: new Uint8Array(credential.credentialPublicKey),
        counter: Number(credential.counter),
        transports: credential.transports as AuthenticatorTransportFuture[]
      },
      requireUserVerification: true
    });
    if (!verification.verified) throw new Error("Passkey verification failed.");
    await db.$transaction([
      db.webAuthnCredential.update({ where: { id: credential.id }, data: { counter: BigInt(verification.authenticationInfo.newCounter), lastUsedAt: new Date() } }),
      db.webAuthnChallenge.delete({ where: { id: challenge.id } })
    ]);
    await createSession(user.id);
    await logSecurityEvent({ request, userId: user.id, action: "LOGIN_PASSKEY", status: "SUCCESS", metadata: { credentialId: credential.id } });
    const defaultPath = dashboardPath(user.role);
    const target = safeRedirectPath(body.redirectTo, defaultPath);
    return NextResponse.json({ verified: true, redirectTo: target === "/dashboard" ? defaultPath : target });
  } catch (error) {
    await logSecurityEvent({ request, userId, action: "LOGIN_PASSKEY", status: "FAILURE" });
    return apiError(error, "Passkey login failed", 401);
  }
}
