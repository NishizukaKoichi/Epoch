import { NextResponse } from "next/server";
import { listAuditLogs } from "../../../../../lib/spell/audit";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? Number(limitParam) : 100;
  const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 500) : 100;

  const audit = await listAuditLogs({ limit: safeLimit });
  return NextResponse.json({ audit });
}
