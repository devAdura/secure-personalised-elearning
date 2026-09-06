import { db } from "@/lib/db";
import { isPrismaConnectionError, withPrismaConnectionRetry } from "@/lib/database-health";

export class LoginRateLimitError extends Error {
  constructor(public readonly retryAfterSeconds: number) {
    super("Too many failed login attempts.");
    this.name = "LoginRateLimitError";
  }
}

export async function assertLoginAllowed(ipAddress: string, actions: string[] = ["LOGIN_PASSWORD"]) {
  const since = new Date(Date.now() - 15 * 60 * 1000);
  let failures: { createdAt: Date }[] = [];

  try {
    failures = await withPrismaConnectionRetry(() =>
      db.securityLog.findMany({
        where: {
          action: { in: actions },
          status: "FAILURE",
          ipAddress,
          createdAt: { gte: since }
        },
        select: { createdAt: true },
        orderBy: { createdAt: "asc" },
        take: 5
      })
    );
  } catch (error) {
    if (!isPrismaConnectionError(error)) throw error;
    console.warn("Login rate-limit check skipped after transient database connection failure");
    return;
  }

  if (failures.length >= 5) {
    const unlockAt = failures[0].createdAt.getTime() + 15 * 60 * 1000;
    const retryAfterSeconds = Math.max(1, Math.ceil((unlockAt - Date.now()) / 1000));
    throw new LoginRateLimitError(retryAfterSeconds);
  }
}
