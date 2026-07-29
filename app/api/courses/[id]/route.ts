import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { courseSchema } from "@/lib/validators";
import { requireCourseOwner } from "@/lib/permissions";
import { logSecurityEvent } from "@/lib/security-log";
import { apiError } from "@/lib/api";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(); if (!user || !["LECTURER", "ADMIN"].includes(user.role)) return NextResponse.json({ error: "Access denied." }, { status: 403 });
  const { id } = await params;
  try { await requireCourseOwner(user.id, user.role, id); const data = courseSchema.parse(await request.json()); const course = await db.course.update({ where: { id }, data: { ...data, thumbnailUrl: data.thumbnailUrl || null } }); await logSecurityEvent({ request, userId: user.id, action: "COURSE_UPDATED", status: "SUCCESS", metadata: { courseId: id } }); return NextResponse.json({ course }); } catch (error) { return apiError(error, "Course update failed"); }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(); if (!user || !["LECTURER", "ADMIN"].includes(user.role)) return NextResponse.json({ error: "Access denied." }, { status: 403 });
  const { id } = await params;
  try { await requireCourseOwner(user.id, user.role, id); await db.course.delete({ where: { id } }); await logSecurityEvent({ request, userId: user.id, action: "COURSE_DELETED", status: "SUCCESS", metadata: { courseId: id } }); return NextResponse.json({ success: true }); } catch (error) { return apiError(error, "Course deletion failed"); }
}
