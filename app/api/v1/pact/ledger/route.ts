import { NextResponse } from "next/server";
import { createLedgerEntry, listLedger } from "../../../../../lib/pact/ledger";
import { getRequestUserId } from "../../../../../lib/platform/request";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const userId = getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const employeeId = searchParams.get("employee_id") ?? undefined;

  const ledger = await listLedger(employeeId);
  return NextResponse.json({ ledger });
}

export async function POST(request: Request) {
  const userId = getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const employeeId = body?.employee_id as string | undefined;
  const metricKey = body?.metric_key as string | undefined;
  const metricValue = body?.metric_value as number | undefined;
  const metricUnit = body?.metric_unit as string | undefined;
  const periodStart = body?.period_start as string | undefined;
  const periodEnd = body?.period_end as string | undefined;

  if (!employeeId || !metricKey || metricValue === undefined || !periodStart || !periodEnd) {
    return NextResponse.json(
      { error: "employee_id, metric_key, metric_value, period_start, period_end are required" },
      { status: 400 }
    );
  }

  try {
    const entry = await createLedgerEntry({
      employeeId,
      metricKey,
      metricValue,
      metricUnit,
      periodStart,
      periodEnd,
    });
    return NextResponse.json({ entry });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create ledger entry";
    return NextResponse.json({ error: message }, { status: 409 });
  }
}
