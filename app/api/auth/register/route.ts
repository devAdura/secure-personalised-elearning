import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { registerSchema } from "@/lib/validators";
import { hashPassword } from "@/lib/password";
import { createSession } from "@/lib/auth";
import { logSecurityEvent } from "@/lib/security-log";
import { apiError } from "@/lib/api";
import { isPrismaConnectionError, withPrismaConnectionRetry } from "@/lib/database-health";

export async function POST(request: Request) {
  try {
    const input = registerSchema.parse(await request.json());
    const exists = await withPrismaConnectionRetry(() => db.user.findUnique({ where: { email: input.email } }));
    if (exists) return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    const user = await db.user.create({
      data: { name: input.name, email: input.email, passwordHash: await hashPassword(input.password), role: input.role }
    });
    await createSession(user.id);
    await logSecurityEvent({ request, userId: user.id, action: "USER_REGISTERED", status: "SUCCESS", metadata: { role: user.role } });
    return NextResponse.json({ success: true, redirectTo: "/passkey-setup?new=1" }, { status: 201 });
  } catch (error) {
    await logSecurityEvent({ request, action: "USER_REGISTERED", status: "FAILURE" });
    const databaseUnavailable = isPrismaConnectionError(error);
    return apiError(
      error,
      databaseUnavailable ? "Registration is temporarily unavailable. Please try again later." : "Registration failed",
      databaseUnavailable ? 503 : 400
    );
  }
}
