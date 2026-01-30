import { NextResponse } from "next/server";
import { listEvents } from "../../../../../lib/talisman/events";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const personId = searchParams.get("person_id") ?? undefined;
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? Number(limitParam) : 100;
  const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 500) : 100;

  const events = await listEvents({ personId, limit: safeLimit });
  return NextResponse.json({ events });
}
