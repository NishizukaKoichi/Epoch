import { NextResponse } from "next/server";
import { getRequestUserId } from "../../../../../../lib/platform/request";
import { audit } from "../../../../../../lib/audit";
import { getOrganizationRole } from "../../../../../../lib/epoch/orgs";

export const runtime = "nodejs";

type Params = { orgId: string };

function canInvite(role: string | null): boolean {
  return role === "owner" || role === "admin" || role === "manager";
}

export async function POST(request: Request, context: { params: Params }) {
  const userId = getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orgId = context.params.orgId;
  const role = await getOrganizationRole(orgId, userId);
  if (!canInvite(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const inviteRole = typeof body?.role === "string" ? body.role : "member";
  const departmentId = typeof body?.departmentId === "string" ? body.departmentId : null;

  if (!email) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }

  await audit("org_invite_sent", {
    actorUserId: userId,
    orgId,
    email,
    role: inviteRole,
    departmentId,
  });

  return NextResponse.json({ ok: true });
}
