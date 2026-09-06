import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash(process.env.ADMIN_SEED_PASSWORD || "CSC/2022/81197", 12);
  const existingAdmin = await prisma.user.findFirst({ where: { role: "ADMIN" }, select: { id: true } });
  const admin = existingAdmin
    ? await prisma.user.update({
        where: { id: existingAdmin.id },
        data: {
          name: "Olalekan Ayomide David",
          email: "Olalekanayomide12111@gmail.com",
          passwordHash,
          role: "ADMIN",
          isActive: true
        },
        select: { id: true, name: true, email: true, role: true, isActive: true }
      })
    : await prisma.user.create({
        data: {
          name: "Olalekan Ayomide David",
          email: "Olalekanayomide12111@gmail.com",
          passwordHash,
          role: "ADMIN"
        },
        select: { id: true, name: true, email: true, role: true, isActive: true }
      });
  await prisma.session.deleteMany({ where: { userId: admin.id } });
  console.log(`Administrator ready: ${admin.name} <${admin.email}>`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
