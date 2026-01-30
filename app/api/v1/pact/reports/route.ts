import { NextResponse } from "next/server";
import { listReports } from "../../../../../lib/pact/reports";
import { getRequestUserId } from "../../../../../lib/platform/request";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const userId = getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reports = await listReports();
  return NextResponse.json({ reports });
}
