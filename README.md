# SecureLearn

## Securing and Personalising Collaborative E-Learning with Fingerprint Biometrics

SecureLearn is a complete final-year undergraduate Computer Science project prototype built with Next.js, TypeScript, Tailwind CSS, Prisma, PostgreSQL and WebAuthn passkeys. It demonstrates secure role-based e-learning for students, lecturers and administrators.

The project deliberately does **not** store raw fingerprints, fingerprint templates or any biometric data. Fingerprint or device verification happens locally on the user's phone or computer. The server receives only a cryptographic WebAuthn response.

## Main features

### Authentication and security

- Student and lecturer self-registration
- Seeded administrator account
- Password login with bcrypt hashing
- Fingerprint/passkey enrolment through WebAuthn
- Fingerprint/passkey login after enrolment
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
- Course review and removal
- Security-log filtering and audit display

## Technology stack

- Next.js App Router and TypeScript
- React and Tailwind CSS
- shadcn-style reusable UI components
- Prisma ORM and PostgreSQL
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
  schema.prisma                PostgreSQL data model
  seed.ts                      Demonstration data and accounts
public/
middleware.ts                  Initial protected-route cookie check
```

## Prerequisites

- Node.js 20 or newer
- npm 10 or newer
- PostgreSQL 15 or newer, or a hosted PostgreSQL provider
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

### 3. Start PostgreSQL

You may use an existing PostgreSQL database or the included Docker Compose file:

```bash
docker compose up -d
```

### 4. Create the environment file

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

macOS/Linux:

```bash
cp .env.example .env
```

The default local database URL already matches the Docker Compose service:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/secure_learning?schema=public"
SESSION_COOKIE_NAME="secure_learning_session"
SESSION_TTL_DAYS="7"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
WEBAUTHN_RP_ID="localhost"
WEBAUTHN_RP_NAME="Secure Personalised E-Learning"
WEBAUTHN_ORIGIN="http://localhost:3000"
CBOR_NATIVE_ACCELERATION_DISABLED="true"
```

### 5. Generate Prisma Client and migrate

```bash
npx prisma generate
npx prisma migrate dev
```

### 6. Seed demonstration data

```bash
npm run prisma:seed
```

### 7. Run the application

```bash
npm run dev
```

Open `http://localhost:3000`.

## Demo accounts

All seeded accounts use this password:

```text
Password123!
```

| Role | Email |
|---|---|
| Admin | `admin@securelearn.test` |
| Lecturer | `lecturer@securelearn.test` |
| Student | `student@securelearn.test` |

Passkeys cannot be pre-seeded because the private key must be created inside the user's real device authenticator. Log in with a demo password, open **Passkey Security**, and enrol the current device.

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

For a safe and deployment-friendly prototype, materials and submissions accept text plus an optional external file URL, such as Google Drive, OneDrive, GitHub or an institutional repository. Direct binary uploads would require a managed object-storage service, file-size controls, malware scanning and access policies.

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

### 2. Create a hosted PostgreSQL database

Create a PostgreSQL database using a provider compatible with Prisma. Copy its connection string into `DATABASE_URL`.

### 3. Import the repository into Vercel

In the Vercel project settings:

- Framework preset: Next.js
- Install command: `npm install`
- Build command: `npm run vercel-build`
- Output directory: leave as the Next.js default

### 4. Add production environment variables

For a production address such as `https://securelearn.example.com`:

```env
DATABASE_URL="YOUR_PRODUCTION_POSTGRESQL_URL"
SESSION_COOKIE_NAME="secure_learning_session"
SESSION_TTL_DAYS="7"
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
DATABASE_URL="YOUR_PRODUCTION_URL" npm run prisma:seed
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
7. Log in as administrator, disable a user and inspect security logs.
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
