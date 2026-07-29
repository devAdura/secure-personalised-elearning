import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { courseSchema } from "@/lib/validators";
import { logSecurityEvent } from "@/lib/security-log";
import { apiError } from "@/lib/api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const level = searchParams.get("level") || "";
  const courses = await db.course.findMany({
    where: {
      isPublished: true,
      ...(query ? { OR: [{ title: { contains: query, mode: "insensitive" } }, { description: { contains: query, mode: "insensitive" } }] } : {}),
      ...(category ? { category } : {}),
      ...(level ? { level } : {})
    },
    include: { lecturer: { select: { name: true } }, _count: { select: { enrollments: true } } },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(courses);
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "LECTURER") return NextResponse.json({ error: "Lecturer access required." }, { status: 403 });
  try {
    const data = courseSchema.parse(await request.json());
    const course = await db.course.create({ data: { ...data, thumbnailUrl: data.thumbnailUrl || null, lecturerId: user.id } });
    await logSecurityEvent({ request, userId: user.id, action: "COURSE_CREATED", status: "SUCCESS", metadata: { courseId: course.id } });
    return NextResponse.json({ course }, { status: 201 });
  } catch (error) { return apiError(error, "Course creation failed"); }
}
