import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { logSecurityEvent } from "@/lib/security-log";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(); if (!user || user.role !== "STUDENT") return NextResponse.json({ error: "Student access required." }, { status: 403 });
  const { id } = await params;
  const course = await db.course.findFirst({ where: { id, isPublished: true } });
  if (!course) return NextResponse.json({ error: "Course not found." }, { status: 404 });
  await db.enrollment.upsert({ where: { userId_courseId: { userId: user.id, courseId: id } }, update: {}, create: { userId: user.id, courseId: id } });
  await db.notification.create({ data: { userId: user.id, title: "Course enrolment confirmed", message: `You are now enrolled in ${course.title}.` } });
  await logSecurityEvent({ request, userId: user.id, action: "COURSE_ENROLMENT", status: "SUCCESS", metadata: { courseId: id } });
  return NextResponse.json({ success: true });
}
