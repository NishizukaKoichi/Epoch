import { NextResponse } from "next/server";
import { getEmployee } from "../../../../../../lib/pact/employees";
import { getRequestUserId } from "../../../../../../lib/platform/request";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  context: { params: { employeeId: string } }
) {
  const userId = getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const employeeId = context.params.employeeId;
  if (!employeeId) {
    return NextResponse.json({ error: "employee_id is required" }, { status: 400 });
  }

  const employee = await getEmployee(employeeId);
  if (!employee) {
    return NextResponse.json({ error: "Employee not found" }, { status: 404 });
  }

  return NextResponse.json({ employee });
}
