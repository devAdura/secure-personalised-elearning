import { NextResponse } from "next/server";
import { sealAudit, seedAudit } from "@/lib/biometric-assurance";

export async function GET() {
  const audit = sealAudit(seedAudit);
  return NextResponse.json({
    ok: true,
    integrity: {
      valid: true,
      entries: audit.length,
      head: audit[audit.length - 1]?.chainHash ?? "GENESIS"
    },
    audit
  });
}
