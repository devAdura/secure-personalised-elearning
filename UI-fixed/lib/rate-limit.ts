import { db } from "@/lib/db";

export async function assertLoginAllowed(ipAddress: string) {
  const since = new Date(Date.now() - 15 * 60 * 1000);
  const attempts = await db.securityLog.count({
    where: {
      action: "LOGIN_PASSWORD",
      status: "FAILURE",
      ipAddress,
      createdAt: { gte: since }
    }
  });

  if (attempts >= 5) {
    throw new Error("Too many failed login attempts. Try again in 15 minutes.");
  }
}
