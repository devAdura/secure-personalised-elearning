import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting production cleanup...");

  await prisma.submission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.material.deleteMany();
  await prisma.discussionPost.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.webAuthnCredential.deleteMany();
  await prisma.securityLog.deleteMany();
  await prisma.course.deleteMany();

  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash(
    "AdminSecure123!",
    12
  );

  await prisma.user.create({
    data: {
      name: "System Administrator",
      email: "admin@securelearn.test",
      passwordHash,
      role: Role.ADMIN,
      isActive: true,
    },
  });

  console.log("Production database cleaned successfully.");
  console.log("New admin account created:");
  console.log("Email: admin@securelearn.test");
  console.log("Password: AdminSecure123!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });