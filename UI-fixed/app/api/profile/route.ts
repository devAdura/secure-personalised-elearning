import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { profileSchema } from "@/lib/validators";
import { db } from "@/lib/db";
import { apiError } from "@/lib/api";

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  try {
    const data = profileSchema.parse(await request.json());
    await db.user.update({ where: { id: user.id }, data });
    return NextResponse.json({ success: true });
  } catch (error) { return apiError(error, "Profile update failed"); }
}
