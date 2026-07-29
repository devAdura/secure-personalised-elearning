import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function apiError(error: unknown, fallback = "Something went wrong", status = 400) {
  if (error instanceof ZodError) {
    return NextResponse.json({ error: error.issues[0]?.message || fallback }, { status });
  }
  const message = error instanceof Error ? error.message : fallback;
  return NextResponse.json({ error: message }, { status });
}
