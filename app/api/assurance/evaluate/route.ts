import { NextResponse } from "next/server";
import { z } from "zod";
import { evaluateAssurance } from "@/lib/biometric-assurance";

const assuranceInputSchema = z.object({
  action: z.enum(["lesson_progress", "peer_review_signature", "exam_start", "exam_submit", "policy_update"]),
  matchScore: z.coerce.number().min(0).max(100),
  livenessScore: z.coerce.number().min(0).max(100),
  templateDistance: z.coerce.number().min(0).max(100),
  behavioralDrift: z.coerce.number().min(0).max(100),
  originBound: z.boolean(),
  credentialKnown: z.boolean(),
  deviceKnown: z.boolean(),
  sequenceSatisfied: z.boolean()
});

export async function POST(request: Request) {
  const payload = assuranceInputSchema.safeParse(await request.json().catch(() => null));
  if (!payload.success) {
    return NextResponse.json({ error: "Invalid assurance evidence." }, { status: 400 });
  }
  return NextResponse.json({ ok: true, assessment: evaluateAssurance(payload.data) });
}
