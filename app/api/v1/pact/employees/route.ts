import { NextResponse } from "next/server";
import { createEmployee, listEmployees } from "../../../../../lib/pact/employees";
import { getRequestUserId } from "../../../../../lib/platform/request";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const userId = getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const employees = await listEmployees();
  return NextResponse.json({ employees });
}

export async function POST(request: Request) {
  const userId = getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const displayName = body?.display_name as string | undefined;
  const roleId = body?.role_id as string | undefined;
  const hiredAt = body?.hired_at as string | undefined;
  const employeeUserId = body?.user_id as string | undefined;

  if (!displayName || !roleId || !hiredAt) {
    return NextResponse.json(
      { error: "display_name, role_id, hired_at are required" },
      { status: 400 }
    );
  }

  try {
    const employee = await createEmployee({
      displayName,
      roleId,
      hiredAt,
      userId: employeeUserId,
    });
    return NextResponse.json({ employee });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create employee";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
