import type { Role } from "@prisma/client";
import { db } from "@/lib/db";

export async function canAccessCourse(userId: string, role: Role, courseId: string) {
  if (role === "ADMIN") return true;
  if (role === "LECTURER") {
    return Boolean(await db.course.findFirst({ where: { id: courseId, lecturerId: userId }, select: { id: true } }));
  }
  return Boolean(await db.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } }, select: { id: true }
  }));
}

export async function requireCourseOwner(userId: string, role: Role, courseId: string) {
  if (role === "ADMIN") return;
  const course = await db.course.findFirst({ where: { id: courseId, lecturerId: userId }, select: { id: true } });
  if (!course) throw new Error("You do not own this course.");
}
