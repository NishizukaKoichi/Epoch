import { NextResponse } from "next/server";
import { getRequestUserId } from "../../../../../../lib/platform/request";
import { getOrganizationRole, listOrganizationMembers, listOrganizationDepartments } from "../../../../../../lib/epoch/orgs";

export const runtime = "nodejs";

type Params = { orgId: string };

export async function GET(request: Request, context: { params: Params }) {
  const userId = getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orgId = context.params.orgId;
  const role = await getOrganizationRole(orgId, userId);
  if (!role) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [members, departments] = await Promise.all([
    listOrganizationMembers(orgId),
    listOrganizationDepartments(orgId),
  ]);

  return NextResponse.json({ members, departments, role });
}
