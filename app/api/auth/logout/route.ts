import { NextResponse } from "next/server";
import { deleteSession, getCurrentUser } from "@/lib/auth";
import { logSecurityEvent } from "@/lib/security-log";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  await deleteSession();
  await logSecurityEvent({ request, userId: user?.id, action: "LOGOUT", status: "SUCCESS" });
  return NextResponse.json({ success: true });
}
