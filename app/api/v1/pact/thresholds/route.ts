import { NextResponse } from "next/server";
import { createThreshold, listThresholds } from "../../../../../lib/pact/thresholds";
import { getRequestUserId } from "../../../../../lib/platform/request";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const userId = getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const thresholds = await listThresholds();
  return NextResponse.json({ thresholds });
}

export async function POST(request: Request) {
  const userId = getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const roleId = body?.role_id as string | undefined;
  const periodDays = body?.period_days as number | undefined;
  const minThreshold = body?.min_threshold as number | undefined;
  const warningThreshold = body?.warning_threshold as number | undefined;
  const criticalThreshold = body?.critical_threshold as number | undefined;
  const growthThreshold = body?.growth_threshold as number | undefined;

  if (
    !roleId ||
    periodDays === undefined ||
    minThreshold === undefined ||
    warningThreshold === undefined ||
    criticalThreshold === undefined ||
    growthThreshold === undefined
  ) {
    return NextResponse.json(
      { error: "role_id, period_days, min_threshold, warning_threshold, critical_threshold, growth_threshold are required" },
      { status: 400 }
    );
  }

  try {
    const threshold = await createThreshold({
      roleId,
      periodDays,
      minThreshold,
      warningThreshold,
      criticalThreshold,
      growthThreshold,
    });
    return NextResponse.json({ threshold });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create threshold";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
