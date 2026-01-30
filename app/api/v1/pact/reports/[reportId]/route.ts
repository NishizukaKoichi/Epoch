import { NextResponse } from "next/server";
import { getReport } from "../../../../../../lib/pact/reports";
import { getRequestUserId } from "../../../../../../lib/platform/request";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  context: { params: { reportId: string } }
) {
  const userId = getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reportId = context.params.reportId;
  if (!reportId) {
    return NextResponse.json({ error: "report_id is required" }, { status: 400 });
  }

  const report = await getReport(reportId);
  if (!report) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  return NextResponse.json({ report });
}
