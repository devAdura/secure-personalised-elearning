# SecureLearn

## Securing and Personalising Collaborative E-Learning with Fingerprint Biometrics

This revision integrates BioLearn Synth's biometric assurance ideas and applies a premium SaaS redesign workflow to the main SecureLearn app.

### Revision highlights

- Added `/assurance`, a biometric assurance command center with risk simulation, sequential fingerprint proof, privacy controls and audit-chain evidence.
- Added shared assurance logic in `lib/biometric-assurance.ts`.
- Added API endpoints for assurance evaluation and audit-chain verification.
- Redesigned the public home page into an operational SecureLearn trust console.
- Redesigned the dashboard shell and metric cards for a premium SaaS command-center feel.
- Added authenticator-app MFA, profile-picture uploads, reversible notification status, spell-checking, and server-enforced assignment deadlines.
- Extended Administrator User Management with guarded permanent deletion for student and lecturer accounts.
- Kept the implementation free-first: no paid biometric provider, AI API, blockchain host, image service or proprietary course service.

SecureLearn is a complete final-year undergraduate Computer Science project prototype built with Next.js, TypeScript, Tailwind CSS, Prisma, Supabase Postgres and WebAuthn passkeys. It demonstrates secure role-based e-learning for students, lecturers and administrators.

The project deliberately does **not** store raw fingerprints, fingerprint templates or any biometric data. Fingerprint or device verification happens locally on the user's phone or computer. The server receives only a cryptographic WebAuthn response.

## Main features

### Authentication and security

- Student and lecturer self-registration
- Seeded administrator account
- Password login with bcrypt hashing
- Fingerprint/passkey enrolment through WebAuthn
- Fingerprint/passkey login after enrolment
- Optional TOTP multi-factor authentication for password sign-ins
- HTTP-only, database-backed sessions
- Role-based route and API protection
- Lecturer course-ownership validation
- Student enrolment validation before course-content access
- Login-attempt throttling
- Expiring one-time WebAuthn challenges
- Security logs for authentication, passkey enrolment, course creation, submissions and administrator actions

### Student workflow

- Personalised dashboard
- Enrolled and recommended courses
- Continue-learning card based on recent activity
- Course browsing, search and filtering
- Course enrolment
- Protected materials and assignments
- Assignment submission by text and optional external file link
- Discussion posts and replies
- Grades, feedback and notifications

### Lecturer workflow

- Course and engagement dashboard
- Create, edit, publish and delete courses
- Add course materials and resource links
- Create assignments
- View enrolled students
- Review submissions
- Add grades and feedback
- Post and moderate course discussions

### Administrator workflow

- Platform statistics
- User filtering and account activation/deactivation
- Permanent student and lecturer deletion with cascading cleanup and audit evidence
- Course review and removal
- Security-log filtering and audit display

## Technology stack

- Next.js App Router and TypeScript
- React and Tailwind CSS
- shadcn-style reusable UI components
- Prisma ORM and Supabase Postgres
- `@simplewebauthn/server` and `@simplewebauthn/browser`
- Zod validation
- bcrypt password hashing
- Recharts analytics
- `next-sitemap` for sitemap and robots generation

## Project structure

```text
app/
  api/                         Server route handlers
  about/                       Academic project explanation
  contact/                     Contact page and form
  login/ and register/         Authentication pages
  passkey-setup/               WebAuthn enrolment
  dashboard/student/           Student dashboard
  dashboard/lecturer/          Lecturer dashboard
  dashboard/admin/             Administrator dashboard
  courses/                     Catalogue and course details
  lecturer/                    Lecturer management workflows
  admin/                       Administrator management pages
components/
  auth/                        Login, registration and passkey UI
  courses/                     Course cards, enrolment and discussions
  dashboard/                   Statistics and analytics
  forms/                       CRUD and review forms
  layout/                      Public and authenticated layouts
  ui/                          Reusable shadcn-style components
lib/
  auth.ts                      Session creation and validation
  db.ts                        Prisma client
  password.ts                  Password hashing helpers
  permissions.ts               Ownership and enrolment checks
  rate-limit.ts                Login attempt protection
  recommendations.ts           Prototype personalisation logic
  security-log.ts              Audit logging
  validators.ts                Zod schemas
  webauthn.ts                  WebAuthn relying-party configuration
prisma/
  schema.prisma                Supabase Postgres data model
  seed.ts                      Demonstration data and accounts
public/
middleware.ts                  Initial protected-route cookie check
```

## Prerequisites

- Node.js 20 or newer
- npm 10 or newer
- An active Supabase project with its Postgres database password
- A WebAuthn-capable browser and device authenticator

WebAuthn works on `localhost` during development. Production passkey authentication requires HTTPS and correct relying-party domain settings.

## Local setup

### 1. Unzip and enter the folder

```bash
cd secure-personalised-elearning
```

### 2. Install packages

```bash
npm install
```

### 3. Prepare Supabase Database

SecureLearn uses Supabase Postgres for all application persistence. In the Supabase dashboard, reactivate or create a project, then copy the database password and connection details from **Project Settings -> Database**.

Use the pooled connection for `DATABASE_URL` and the direct connection for `DIRECT_URL`.

### 4. Create the environment file

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

macOS/Linux:

```bash
cp .env.example .env
```

Fill in the Supabase values:

```env
DATABASE_URL="postgresql://postgres.<PROJECT_REF>:<DB_PASSWORD>@aws-0-<REGION>.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres:<DB_PASSWORD>@db.<PROJECT_REF>.supabase.co:5432/postgres?sslmode=require"
SESSION_COOKIE_NAME="secure_learning_session"
SESSION_TTL_DAYS="7"
MFA_ENCRYPTION_KEY="replace-with-at-least-32-random-characters"
ADMIN_SEED_PASSWORD="CSC/2022/81197"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
WEBAUTHN_RP_ID="localhost"
WEBAUTHN_RP_NAME="Secure Personalised E-Learning"
WEBAUTHN_ORIGIN="http://localhost:3000"
CBOR_NATIVE_ACCELERATION_DISABLED="true"
```

For example, if your project ref is `aqsefkcbhgsrxbjkuuvp` in `eu-west-3`, the pooled host is `aws-0-eu-west-3.pooler.supabase.com` and the direct host is `db.aqsefkcbhgsrxbjkuuvp.supabase.co`. Replace `<DB_PASSWORD>` with the database password from Supabase.

Do not put a Supabase `service_role` key in `NEXT_PUBLIC_*` variables. This app uses server-side Prisma queries, so the Postgres URLs are the database credentials it needs.

### 5. Generate Prisma Client and apply migrations

```bash
npx prisma generate
npm run prisma:deploy
```

### 6. Seed demonstration data

```bash
npm run prisma:seed
```

The full demonstration seed resets application records. To create or update only the requested Administrator account without touching existing data, run:

```bash
npm run prisma:seed-admin
```

### 7. Run the application

```bash
npm run dev
```

Open `http://localhost:3000`.

## Demo accounts

| Role | Name | Email | Password |
|---|---|---|---|
| Admin | Olalekan Ayomide David | `admin@securelearn.test` | `CSC/2022/81197` |
| Lecturer | Dr Grace Okafor | `lecturer@securelearn.test` | `Password123!` |
| Student | Ada Nwosu | `student@securelearn.test` | `Password123!` |

Passkeys cannot be pre-seeded because the private key must be created inside the user's real device authenticator. Log in with a demo password, open **Security & MFA**, and enrol the current device.

Authenticator MFA cannot be pre-seeded because the shared secret must be enrolled in the user's own authenticator app. Open **Security & MFA**, scan the generated QR code, and verify one current 6-digit code. Production deployments must set a stable `MFA_ENCRYPTION_KEY`; changing it invalidates existing authenticator enrolments.

## How the Biometric Security Works

1. The user signs in with a password and opens the passkey setup page.
2. The server creates a unique, short-lived WebAuthn challenge.
3. The browser asks the device authenticator to create a credential.
4. The fingerprint scan, face check, PIN or device-screen-lock check happens entirely on the device.
5. The device keeps the private key and returns the credential public key plus a signed response.
6. SecureLearn verifies the response and stores the credential ID, public key, counter, transports and related non-biometric metadata.
7. During a later passkey login, the server creates another challenge.
8. The device verifies the user locally and signs that challenge.
9. The server verifies the signature with the stored public key and creates a secure session.

The application therefore receives **cryptographic proof**, not a fingerprint. This is safer and more privacy-preserving than storing fingerprint images or templates in an application database.

## Personalisation logic

The recommendation engine is intentionally understandable for an undergraduate defence:

- It identifies categories from the student's existing enrolments.
- It recommends other published courses from those categories.
- When the student has little or no enrolment history, it prioritises beginner courses.
- It excludes courses already enrolled in.
- It fills remaining recommendation slots with recently created published courses.
- “Continue learning” uses the student's latest recorded course-view activity.
- Pending assignments are sorted by due date and exclude assignments already submitted.

This rule-based approach is transparent, easy to evaluate and suitable for a prototype. A future version could use collaborative filtering or learning analytics after obtaining a larger dataset.

## File handling scope

Profile pictures accept a validated JPG, PNG or WebP image up to 750 KB and store it with the user's Supabase Postgres profile record. Course materials and assignment submissions continue to accept text plus an optional external file URL, such as Google Drive, OneDrive, GitHub or an institutional repository.

## Validation and production build

```bash
npm run validate:structure
npm run typecheck
npm run build
npm start
```

The build command generates Prisma Client, builds Next.js and then runs `next-sitemap` through the `postbuild` lifecycle.

## Deploying with GitHub and Vercel

### 1. Create a Git repository

```bash
git init
git add .
git commit -m "Initial SecureLearn full-stack application"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/secure-personalised-elearning.git
git push -u origin main
```

### 2. Connect Supabase Database

Use an active Supabase project. In Vercel, set `DATABASE_URL` to the Supabase Transaction Pooler URI and `DIRECT_URL` to the Supabase direct connection URI.

### 3. Import the repository into Vercel

In the Vercel project settings:

- Framework preset: Next.js
- Install command: `npm install`
- Build command: `npm run vercel-build`
- Output directory: leave as the Next.js default

### 4. Add production environment variables

For a production address such as `https://securelearn.example.com`:

```env
DATABASE_URL="postgresql://postgres.<PROJECT_REF>:<DB_PASSWORD>@aws-0-<REGION>.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres:<DB_PASSWORD>@db.<PROJECT_REF>.supabase.co:5432/postgres?sslmode=require"
SESSION_COOKIE_NAME="secure_learning_session"
SESSION_TTL_DAYS="7"
MFA_ENCRYPTION_KEY="replace-with-at-least-32-random-characters"
ADMIN_SEED_PASSWORD="CSC/2022/81197"
NEXT_PUBLIC_APP_URL="https://securelearn.example.com"
WEBAUTHN_RP_ID="securelearn.example.com"
WEBAUTHN_RP_NAME="Secure Personalised E-Learning"
WEBAUTHN_ORIGIN="https://securelearn.example.com"
CBOR_NATIVE_ACCELERATION_DISABLED="true"
```

For a default Vercel domain such as `securelearn-project.vercel.app`, use:

```env
NEXT_PUBLIC_APP_URL="https://securelearn-project.vercel.app"
WEBAUTHN_RP_ID="securelearn-project.vercel.app"
WEBAUTHN_ORIGIN="https://securelearn-project.vercel.app"
```

`WEBAUTHN_ORIGIN` must exactly match the browser origin. `WEBAUTHN_RP_ID` is the domain only, without `https://` or a path.

### 5. Apply migrations and seed once

The supplied Vercel build script runs `prisma migrate deploy`. Seed production only when demonstration data is appropriate:

```bash
DATABASE_URL="YOUR_SUPABASE_POOLER_URL" DIRECT_URL="YOUR_SUPABASE_DIRECT_URL" npm run prisma:seed
```

Do not repeatedly seed a live production database because the seed resets demonstration records.

### 6. Test passkeys on the final domain

Passkeys are bound to the relying-party domain. Credentials enrolled on `localhost` will not authenticate on the Vercel domain. Log in with a password on the deployed site and enrol a new passkey for that domain.

## Useful commands

```bash
npm run dev
npm run typecheck
npm run validate:structure
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run prisma:seed-admin
npm run build
npm run vercel-build
npx prisma studio
```

## Suggested project demonstration

1. Show the homepage and explain that fingerprints are not stored.
2. Register a student account and log in with a password.
3. Enrol a passkey and show the resulting credential record in Prisma Studio.
4. Log out and return using the passkey button.
5. Enrol in a course, view materials, post a discussion reply and submit an assignment.
6. Log in as the lecturer, create a course or assignment and grade the submission.
7. Log in as administrator, disable or permanently delete a non-administrator user, and inspect security logs.
8. Explain the recommendation rules and the database relationships.

## Limitations and future improvements

- Add verified email delivery and password-reset flows.
- Use distributed rate limiting for multi-instance deployments.
- Add real object storage with malware scanning for direct uploads.
- Add richer learning-progress tracking and completion percentages.
- Add quizzes, live classes and lecturer announcements as a dedicated model.
- Add automated tests with Playwright and a disposable test database.
- Add WebAuthn account recovery and multiple-device management.
- Add institution-level multi-tenancy if the system expands beyond one school.

## Academic defence emphasis

The central security decision is that “fingerprint login” on the web is implemented through WebAuthn/passkeys. The biometric sensor is controlled by the operating system. SecureLearn validates public-key signatures and does not become a biometric-data custodian. This interpretation is technically correct, privacy-preserving and suitable for real-world deployment.
