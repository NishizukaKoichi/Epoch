import { NextResponse } from "next/server";
import { listEmployeesForUser } from "../../../../../lib/pact/employees";
import { getRequestUserId } from "../../../../../lib/platform/request";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const userId = getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const employees = await listEmployeesForUser(userId);
  return NextResponse.json({ employees });
}
