import { NextResponse } from "next/server";
import { verifyRegistrationResponse, type RegistrationResponseJSON } from "@simplewebauthn/server";
import { getCurrentUser, dashboardPath } from "@/lib/auth";
import { db } from "@/lib/db";
import { expectedOrigin, rpID } from "@/lib/webauthn";
import { logSecurityEvent } from "@/lib/security-log";
import { apiError } from "@/lib/api";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  try {
    const response = await request.json() as RegistrationResponseJSON;
    const stored = await db.webAuthnChallenge.findFirst({
      where: { userId: user.id, type: "REGISTRATION", expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" }
    });
    if (!stored) throw new Error("Passkey setup session expired. Start again.");
    const verification = await verifyRegistrationResponse({
      response,
      expectedChallenge: stored.challenge,
      expectedOrigin,
      expectedRPID: rpID,
      requireUserVerification: true
    });
    if (!verification.verified || !verification.registrationInfo) throw new Error("Passkey could not be verified.");
    const { credential, credentialDeviceType, credentialBackedUp } = verification.registrationInfo;
    await db.webAuthnCredential.upsert({
      where: { credentialID: credential.id },
      update: {
        credentialPublicKey: Buffer.from(credential.publicKey),
        counter: BigInt(credential.counter),
        transports: (credential.transports || []) as string[],
        deviceType: credentialDeviceType,
        backedUp: credentialBackedUp
      },
      create: {
        userId: user.id,
        credentialID: credential.id,
        credentialPublicKey: Buffer.from(credential.publicKey),
        counter: BigInt(credential.counter),
        transports: (credential.transports || []) as string[],
        deviceType: credentialDeviceType,
        backedUp: credentialBackedUp
      }
    });
    await db.webAuthnChallenge.delete({ where: { id: stored.id } });
    await db.notification.create({ data: { userId: user.id, title: "Passkey security enabled", message: "A new device passkey was enrolled on your SecureLearn account." } });
    await logSecurityEvent({ request, userId: user.id, action: "PASSKEY_ENROLMENT", status: "SUCCESS", metadata: { deviceType: credentialDeviceType, backedUp: credentialBackedUp } });
    return NextResponse.json({ verified: true, redirectTo: dashboardPath(user.role) });
  } catch (error) {
    await logSecurityEvent({ request, userId: user.id, action: "PASSKEY_ENROLMENT", status: "FAILURE" });
    return apiError(error, "Passkey enrolment failed");
  }
}
