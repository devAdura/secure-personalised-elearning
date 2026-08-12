import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";
import { db } from "@/lib/db";
import { isPrismaConnectionError, isRuntimeDatabaseConfigured, withPrismaConnectionRetry } from "@/lib/database-health";

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "secure_learning_session";
const SESSION_DAYS = Number(process.env.SESSION_TTL_DAYS || 7);

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: string) {
  const token = crypto.randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await withPrismaConnectionRetry(() => db.session.create({ data: { userId, tokenHash: hashToken(token), expiresAt } }));
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt
  });
}

export async function deleteSession() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (token) {
    try {
      await withPrismaConnectionRetry(() => db.session.deleteMany({ where: { tokenHash: hashToken(token) } }), 2);
    } catch (error) {
      if (!isPrismaConnectionError(error)) throw error;
    }
  }
  store.delete(COOKIE_NAME);
}

export async function getCurrentUser() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  if (!isRuntimeDatabaseConfigured()) return null;

  let session;
  try {
    session = await withPrismaConnectionRetry(() => db.session.findUnique({
      where: { tokenHash: hashToken(token) },
      include: {
        user: {
          include: { webAuthnCredentials: { select: { id: true, createdAt: true, lastUsedAt: true } } }
        }
      }
    }));
  } catch (error) {
    if (isPrismaConnectionError(error)) return null;
    throw error;
  }

  if (!session || session.expiresAt <= new Date() || !session.user.isActive) {
    if (session) {
      try {
        await withPrismaConnectionRetry(() => db.session.delete({ where: { id: session.id } }), 2);
      } catch (error) {
        if (!isPrismaConnectionError(error)) throw error;
      }
    }
    return null;
  }
  return session.user;
}

export async function requireUser(roles?: Role[]) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (roles && !roles.includes(user.role)) redirect(`/dashboard/${user.role.toLowerCase()}`);
  return user;
}

export function dashboardPath(role: Role) {
  return `/dashboard/${role.toLowerCase()}`;
}
