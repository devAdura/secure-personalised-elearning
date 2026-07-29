import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { discussionSchema } from "@/lib/validators";
import { canAccessCourse } from "@/lib/permissions";
import { apiError } from "@/lib/api";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(); if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const { id } = await params;
  try {
    if (!(await canAccessCourse(user.id, user.role, id))) throw new Error("Enrolment or course ownership is required.");
    const data = discussionSchema.parse(await request.json());
    if (data.parentId) { const parent = await db.discussionPost.findFirst({ where: { id: data.parentId, courseId: id } }); if (!parent) throw new Error("Reply target not found."); }
    const post = await db.discussionPost.create({ data: { courseId: id, authorId: user.id, content: data.content, parentId: data.parentId || null } });
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) { return apiError(error, "Discussion post failed"); }
}
