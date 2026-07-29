import fs from "node:fs";
import path from "node:path";

const required = [
  "app/page.tsx", "app/login/page.tsx", "app/register/page.tsx", "app/passkey-setup/page.tsx",
  "app/dashboard/student/page.tsx", "app/dashboard/lecturer/page.tsx", "app/dashboard/admin/page.tsx",
  "app/api/auth/passkey/register-options/route.ts", "app/api/auth/passkey/authentication-verify/route.ts",
  "prisma/schema.prisma", "prisma/seed.ts", "prisma/migrations/20260726143000_initial/migration.sql",
  "middleware.ts", "README.md", "DEPLOYMENT_PROMPTS.md", "PROJECT_DEFENCE_GUIDE.md", ".env.example"
];
const missing = required.filter((file) => !fs.existsSync(path.resolve(file)));
if (missing.length) { console.error("Missing required files:\n" + missing.join("\n")); process.exit(1); }
const schema = fs.readFileSync("prisma/schema.prisma", "utf8");
for (const model of ["User", "Session", "WebAuthnCredential", "WebAuthnChallenge", "Course", "Enrollment", "Material", "Assignment", "Submission", "DiscussionPost", "Notification", "SecurityLog", "LearningActivity", "ContactMessage"]) {
  if (!schema.includes(`model ${model} `)) { console.error(`Missing Prisma model: ${model}`); process.exit(1); }
}
console.log(`Project structure validation passed (${required.length} required files checked).`);
