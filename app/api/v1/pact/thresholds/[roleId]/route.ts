import { NextResponse } from "next/server";
import { listThresholdsForRole } from "../../../../../../lib/pact/thresholds";
import { getRequestUserId } from "../../../../../../lib/platform/request";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  context: { params: { roleId: string } }
) {
  const userId = getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const roleId = context.params.roleId;
  if (!roleId) {
    return NextResponse.json({ error: "role_id is required" }, { status: 400 });
  }

  const thresholds = await listThresholdsForRole(roleId);
  return NextResponse.json({ thresholds });
}
