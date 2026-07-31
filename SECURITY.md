# Security Notes

## Biometric boundary

SecureLearn never receives a fingerprint image, fingerprint template, face image, device PIN or biometric matching score. The browser communicates with the operating system authenticator through WebAuthn. The authenticator verifies the user locally and signs a server-generated challenge.

The application stores only:

- WebAuthn credential ID
- Credential public key
- Signature counter
- Authenticator transports
- Device type and backup state
- Creation and last-used timestamps

## Implemented controls

- Password hashes use bcrypt with 12 rounds.
- Sessions use random 256-bit tokens; only SHA-256 token hashes are stored in Supabase Postgres.
- Session cookies are HTTP-only, SameSite=Lax and Secure in production.
- WebAuthn challenges expire after five minutes and are deleted after successful use.
- WebAuthn registration and authentication require user verification.
- Login attempts are throttled after five failures from one IP in fifteen minutes.
- Route handlers repeat role and ownership checks even when middleware is present.
- Students must be enrolled before protected course content is returned.
- Lecturer ownership is validated before course modification, material creation, assignment creation or submission review.
- Major authentication, course, submission and administrator events are logged.
- Public registration cannot create administrator accounts.

## Production recommendations

For a production deployment beyond an undergraduate prototype, add CSRF tokens for mutation forms, managed distributed rate limiting, email verification, password reset, account recovery, stronger administrator provisioning, malware scanning for uploaded files, content moderation, database backups, secret rotation, security headers, monitoring and automated dependency scanning.
