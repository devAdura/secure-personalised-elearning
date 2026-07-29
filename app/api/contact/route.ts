import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validators";
import { db } from "@/lib/db";
import { apiError } from "@/lib/api";

export async function POST(request: Request) {
  try {
    const data = contactSchema.parse(await request.json());
    await db.contactMessage.create({ data });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) { return apiError(error, "Message could not be submitted"); }
}
