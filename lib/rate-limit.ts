import { db } from "@/lib/db";
import { isPrismaConnectionError, withPrismaConnectionRetry } from "@/lib/database-health";

export async function assertLoginAllowed(ipAddress: string) {
  const since = new Date(Date.now() - 15 * 60 * 1000);
  let attempts = 0;

  try {
    attempts = await withPrismaConnectionRetry(() =>
      db.securityLog.count({
        where: {
          action: "LOGIN_PASSWORD",
          status: "FAILURE",
          ipAddress,
          createdAt: { gte: since }
        }
      })
    );
  } catch (error) {
    if (!isPrismaConnectionError(error)) throw error;
    console.warn("Login rate-limit check skipped after transient database connection failure");
    return;
  }

  if (attempts >= 5) {
    throw new Error("Too many failed login attempts. Try again in 15 minutes.");
  }
}
