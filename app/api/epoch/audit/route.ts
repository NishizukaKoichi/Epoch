import { NextResponse } from "next/server";
import { getRequestUserId } from "../../../../lib/platform/request";
import { listAuditLogs } from "../../../../lib/epoch/audit-log";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const userId = getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter") as "all" | "user" | "operator" | null;
  const logs = await listAuditLogs({
    userId,
    filter: filter ?? "all",
  });
  return NextResponse.json({ logs });
}
