export const rpID = process.env.WEBAUTHN_RP_ID || "localhost";
export const rpName = process.env.WEBAUTHN_RP_NAME || "Secure Personalised E-Learning";
export const expectedOrigin = process.env.WEBAUTHN_ORIGIN || "http://localhost:3000";
export const challengeLifetimeMs = 5 * 60 * 1000;

// Biometrics never reach this application. The device authenticator verifies the
// fingerprint or screen lock locally, and WebAuthn returns a signed challenge.
// The server stores only the public credential, ID, transports and counter.
