import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

// Marks a notification read or unread. Body `{ read: boolean }` is optional and
// defaults to true, so existing callers keep working; passing `{ read: false }`
// powers the "undo" action in the notifications panel.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const { id } = await params;
  const body = await request.json().catch(() => ({} as { read?: boolean }));
  const isRead = body?.read === undefined ? true : Boolean(body.read);
  await db.notification.updateMany({ where: { id, userId: user.id }, data: { isRead } });
  return NextResponse.json({ success: true, isRead });
}
