import { NextResponse } from "next/server";
import { z } from "zod";
import { apiError } from "@/lib/api";
import { findSpellingIssues } from "@/lib/spellcheck";

export const runtime = "nodejs";

const requestSchema = z.object({ text: z.string().max(10_000) });

export async function POST(request: Request) {
  try {
    const { text } = requestSchema.parse(await request.json());
    return NextResponse.json({ issues: await findSpellingIssues(text) });
  } catch (error) {
    return apiError(error, "Spelling could not be checked");
  }
}
