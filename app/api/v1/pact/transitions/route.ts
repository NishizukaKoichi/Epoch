import { NextResponse } from "next/server";
import { listTransitions } from "../../../../../lib/pact/transitions";
import { getRequestUserId } from "../../../../../lib/platform/request";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const userId = getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const employeeId = searchParams.get("employee_id") ?? undefined;

  const transitions = await listTransitions(employeeId);
  return NextResponse.json({ transitions });
}
