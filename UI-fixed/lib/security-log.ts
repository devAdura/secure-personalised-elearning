import { SecurityStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { getClientInfo } from "@/lib/utils";

export async function logSecurityEvent({
  request,
  userId,
  action,
  status,
  metadata
}: {
  request?: Request;
  userId?: string | null;
  action: string;
  status: SecurityStatus;
  metadata?: Record<string, unknown>;
}) {
  const client = request ? getClientInfo(request) : { ipAddress: "system", userAgent: "system" };
  try {
    await db.securityLog.create({
      data: {
        userId: userId ?? null,
        action,
        status,
        ipAddress: client.ipAddress,
        userAgent: client.userAgent,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined
      }
    });
  } catch (error) {
    console.error("Security log failed", error);
  }
}
