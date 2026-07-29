# Recovery and Deployment Prompts

These prompts are provided for use with ChatGPT, Codex or another coding assistant after downloading the project. Run them from the project root and provide terminal output when requested.

## Prompt 1: Complete local installation on Windows

```text
You are working inside my downloaded SecureLearn Next.js project folder. Inspect package.json, .env.example and prisma/schema.prisma. On Windows PowerShell, install dependencies, verify Node and npm versions, start PostgreSQL with docker compose if Docker is available, create .env, run Prisma generate, create the initial migration, seed the database, run type checking, fix any genuine code errors without weakening security, and start npm run dev. Keep WebAuthn configured for localhost. Do not replace WebAuthn with fake biometric storage.
```

## Prompt 2: Diagnose npm installation errors

```text
Inspect this SecureLearn project and the terminal error I provide. Fix only the package, Node-version, lockfile or configuration issue causing npm install to fail. Preserve Next.js App Router, Prisma PostgreSQL and @simplewebauthn. After the fix, run npm install, npm run typecheck, npm run validate:structure and npm run build. Explain each changed file briefly.
```

## Prompt 3: Prepare GitHub repository

```text
Inside this SecureLearn project, verify that .env, node_modules, .next and local secrets are ignored. Initialise Git, create a clean first commit, and give me the exact commands to create and push a main branch to my GitHub repository URL. Do not commit any database password or production secret.
```

## Prompt 4: Deploy to Vercel

```text
Prepare this SecureLearn project for Vercel using my final Vercel domain and PostgreSQL connection string. Set NEXT_PUBLIC_APP_URL, WEBAUTHN_ORIGIN and WEBAUTHN_RP_ID correctly for the exact HTTPS domain. Verify the vercel-build script, run Prisma generate and migrate deploy, run a production build, and provide the exact Vercel environment-variable list. Remind me that localhost passkeys must be re-enrolled on the production domain.
```

## Prompt 5: Verify the complete demonstration

```text
Run a structured acceptance test of the SecureLearn application. Test public pages, student and lecturer registration, password login, passkey enrolment, passkey login, student course enrolment, protected course access, discussion posts and replies, assignment submission, lecturer course ownership, grading, admin user disabling, admin course removal, security logs, recommendations, notifications, responsive layouts and production build. Record every failure with reproduction steps and implement fixes. Never store raw biometric data.
```
