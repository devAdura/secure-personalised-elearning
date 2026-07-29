import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { assignmentSchema } from "@/lib/validators";
import { requireCourseOwner } from "@/lib/permissions";
import { apiError } from "@/lib/api";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(); if (!user || user.role !== "LECTURER") return NextResponse.json({ error: "Lecturer access required." }, { status: 403 });
  const { id } = await params;
  try {
    await requireCourseOwner(user.id, user.role, id); const data = assignmentSchema.parse(await request.json());
    const assignment = await db.assignment.create({ data: { ...data, courseId: id } });
    const course = await db.course.findUnique({ where: { id }, select: { title: true, enrollments: { select: { userId: true } } } });
    if (course?.enrollments.length) await db.notification.createMany({ data: course.enrollments.map((e) => ({ userId: e.userId, title: "New assignment", message: `${data.title} has been posted in ${course.title}.` })) });
    return NextResponse.json({ assignment }, { status: 201 });
  } catch (error) { return apiError(error, "Assignment creation failed"); }
}
