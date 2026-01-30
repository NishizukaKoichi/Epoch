import { NextResponse } from "next/server";
import { generateReport } from "../../../../../../lib/pact/reports";
import { getRequestUserId } from "../../../../../../lib/platform/request";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const userId = getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const employeeId = body?.employee_id as string | undefined;
  const periodStart = body?.period_start as string | undefined;
  const periodEnd = body?.period_end as string | undefined;

  if (!employeeId || !periodStart || !periodEnd) {
    return NextResponse.json(
      { error: "employee_id, period_start, period_end are required" },
      { status: 400 }
    );
  }

  try {
    const report = await generateReport({ employeeId, periodStart, periodEnd });
    return NextResponse.json({ report });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate report";
    return NextResponse.json({ error: message }, { status: 409 });
  }
}
