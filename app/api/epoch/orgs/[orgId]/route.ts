import { NextResponse } from "next/server";
import { getRequestUserId } from "../../../../../lib/platform/request";
import { audit } from "../../../../../lib/audit";
import {
  deleteOrganization,
  getOrganizationDetail,
  getOrganizationRole,
  getOrganizationStats,
  listOrganizationDepartments,
  updateOrganization,
} from "../../../../../lib/epoch/orgs";

export const runtime = "nodejs";

type Params = { orgId: string };

async function requireMember(orgId: string, userId: string): Promise<string | null> {
  const role = await getOrganizationRole(orgId, userId);
  return role;
}

function isOrgAdmin(role: string | null): boolean {
  return role === "owner" || role === "admin";
}

export async function GET(request: Request, context: { params: Params }) {
  const userId = getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orgId = context.params.orgId;
  const role = await requireMember(orgId, userId);
  if (!role) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const org = await getOrganizationDetail(orgId);
  if (!org) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const stats = await getOrganizationStats(orgId);
  const departments = await listOrganizationDepartments(orgId);

  return NextResponse.json({ org, stats, departments, role });
}

export async function PATCH(request: Request, context: { params: Params }) {
  const userId = getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orgId = context.params.orgId;
  const role = await requireMember(orgId, userId);
  if (!isOrgAdmin(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const slug = typeof body?.slug === "string" ? body.slug.trim() : "";

  if (!name || !slug) {
    return NextResponse.json({ error: "name and slug are required" }, { status: 400 });
  }

  const currentOrg = await getOrganizationDetail(orgId);
  if (!currentOrg) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isPublic =
    typeof body?.isPublic === "boolean" ? body.isPublic : currentOrg.isPublic;

  try {
    const org = await updateOrganization({
      orgId,
      name,
      slug,
      allowMemberEpochAccess: Boolean(body?.allowMemberEpochAccess),
      requireApprovalForJoin: body?.requireApprovalForJoin !== false,
      isPublic,
    });
    await audit("org_updated", { actorUserId: userId, orgId });
    return NextResponse.json({ org });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update organization";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request, context: { params: Params }) {
  const userId = getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orgId = context.params.orgId;
  const role = await requireMember(orgId, userId);
  if (!isOrgAdmin(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await deleteOrganization(orgId);
  await audit("org_deleted", { actorUserId: userId, orgId });
  return NextResponse.json({ ok: true });
}
