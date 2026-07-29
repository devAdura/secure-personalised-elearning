import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { loginSchema } from "@/lib/validators";
import { verifyPassword } from "@/lib/password";
import { createSession, dashboardPath } from "@/lib/auth";
import { logSecurityEvent } from "@/lib/security-log";
import { assertLoginAllowed } from "@/lib/rate-limit";
import { getClientInfo, safeRedirectPath } from "@/lib/utils";
import { apiError } from "@/lib/api";

export async function POST(request: Request) {
  let email = "unknown";
  try {
    const input = loginSchema.parse(await request.json());
    email = input.email;
    const { ipAddress } = getClientInfo(request);
    await assertLoginAllowed(ipAddress);
    const user = await db.user.findUnique({ where: { email: input.email } });
    if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
      await logSecurityEvent({ request, userId: user?.id, action: "LOGIN_PASSWORD", status: "FAILURE", metadata: { email } });
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }
    if (!user.isActive) {
      await logSecurityEvent({ request, userId: user.id, action: "LOGIN_PASSWORD", status: "FAILURE", metadata: { reason: "disabled" } });
      return NextResponse.json({ error: "This account has been disabled by an administrator." }, { status: 403 });
    }
    await createSession(user.id);
    await logSecurityEvent({ request, userId: user.id, action: "LOGIN_PASSWORD", status: "SUCCESS" });
    const defaultPath = dashboardPath(user.role);
    return NextResponse.json({ success: true, redirectTo: safeRedirectPath(input.redirectTo, defaultPath) === "/dashboard" ? defaultPath : safeRedirectPath(input.redirectTo, defaultPath) });
  } catch (error) {
    await logSecurityEvent({ request, action: "LOGIN_PASSWORD", status: "FAILURE", metadata: { email } });
    return apiError(error, "Login failed", error instanceof Error && error.message.includes("Too many") ? 429 : 400);
  }
}
