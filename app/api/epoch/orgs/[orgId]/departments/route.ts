import { NextResponse } from "next/server";
import { getRequestUserId } from "../../../../../../lib/platform/request";
import { audit } from "../../../../../../lib/audit";
import {
  createOrganizationDepartment,
  getOrganizationRole,
  listOrganizationDepartments,
} from "../../../../../../lib/epoch/orgs";

export const runtime = "nodejs";

type Params = { orgId: string };

function isOrgAdmin(role: string | null): boolean {
  return role === "owner" || role === "admin";
}

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

  const departments = await listOrganizationDepartments(orgId);
  return NextResponse.json({ departments });
}

export async function POST(request: Request, context: { params: Params }) {
  const userId = getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orgId = context.params.orgId;
  const role = await getOrganizationRole(orgId, userId);
  if (!isOrgAdmin(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  if (!name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const department = await createOrganizationDepartment({
    orgId,
    name,
    parentId: typeof body?.parentId === "string" ? body.parentId : null,
  });
  await audit("org_department_created", { actorUserId: userId, orgId, departmentId: department.id });
  return NextResponse.json({ department }, { status: 201 });
}
