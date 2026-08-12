export function isRuntimeDatabaseConfigured() {
  const databaseUrl = process.env.DATABASE_URL?.trim() || "";
  if (!databaseUrl || /<[^>]+>/.test(databaseUrl)) return false;

  try {
    const parsed = new URL(databaseUrl);
    return (parsed.protocol === "postgresql:" || parsed.protocol === "postgres:") && Boolean(parsed.hostname);
  } catch {
    return /^postgres(?:ql)?:\/\//i.test(databaseUrl);
  }
}

export function isPrismaConnectionError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code?: unknown }).code ?? "")
      : "";

  return (
    code === "P1000" ||
    code === "P1001" ||
    code === "P1002" ||
    code === "P1008" ||
    code === "P1012" ||
    code === "P1017" ||
    /Can't reach database server|ECONNREFUSED|connect ECONNREFUSED|connection refused|ETIMEDOUT|ECONNRESET|Connection terminated|Environment variable not found|DATABASE_URL|DIRECT_URL/i.test(message)
  );
}

export async function withPrismaConnectionRetry<T>(operation: () => Promise<T>, attempts = 3): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (!isPrismaConnectionError(error) || attempt === attempts) break;
      await new Promise((resolve) => setTimeout(resolve, attempt * 450));
    }
  }

  throw lastError;
}
