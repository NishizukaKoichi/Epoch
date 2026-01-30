import { NextResponse } from "next/server";
import { getRequestUserId } from "../../../../../../../lib/platform/request";
import { audit } from "../../../../../../../lib/audit";
import {
  deleteOrganizationDepartment,
  getOrganizationRole,
  updateOrganizationDepartment,
} from "../../../../../../../lib/epoch/orgs";

export const runtime = "nodejs";

type Params = { orgId: string; departmentId: string };

function isOrgAdmin(role: string | null): boolean {
  return role === "owner" || role === "admin";
}

export async function PATCH(request: Request, context: { params: Params }) {
  const userId = getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orgId, departmentId } = context.params;
  const role = await getOrganizationRole(orgId, userId);
  if (!isOrgAdmin(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  if (!name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const department = await updateOrganizationDepartment({
    departmentId,
    name,
    parentId: typeof body?.parentId === "string" ? body.parentId : null,
  });
  await audit("org_department_updated", { actorUserId: userId, orgId, departmentId });
  return NextResponse.json({ department });
}

export async function DELETE(request: Request, context: { params: Params }) {
  const userId = getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orgId, departmentId } = context.params;
  const role = await getOrganizationRole(orgId, userId);
  if (!isOrgAdmin(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await deleteOrganizationDepartment(departmentId);
  await audit("org_department_deleted", { actorUserId: userId, orgId, departmentId });
  return NextResponse.json({ ok: true });
}
