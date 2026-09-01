import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validators";
import { db } from "@/lib/db";
import { apiError } from "@/lib/api";

export async function POST(request: Request) {
  try {
    const data = contactSchema.parse(await request.json());
    const administrators = await db.user.findMany({
      where: { role: "ADMIN", isActive: true },
      select: { id: true }
    });
    const contactMessage = db.contactMessage.create({ data });
    if (administrators.length) {
      await db.$transaction([
        contactMessage,
        db.notification.createMany({
          data: administrators.map((administrator) => ({
            userId: administrator.id,
            title: data.subject.toLowerCase().includes("disabled account") ? "New account appeal" : "New contact message",
            message: `${data.name} (${data.email}) sent: ${data.subject}`
          }))
        })
      ]);
    } else {
      await contactMessage;
    }
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) { return apiError(error, "Message could not be submitted"); }
}
