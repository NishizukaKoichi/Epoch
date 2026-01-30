import { NextResponse } from "next/server";
import { getPublicOrganization, listPublicMembers } from "../../../../../../lib/epoch/orgs";

export const runtime = "nodejs";

type Params = { orgId: string };

export async function GET(_request: Request, context: { params: Params }) {
  const orgId = context.params.orgId;
  const org = await getPublicOrganization(orgId);
  if (!org) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const members = await listPublicMembers(orgId);
  return NextResponse.json({
    org,
    members: members.map((member) => ({
      id: member.userId,
      displayName: member.displayName,
      department: member.department,
      role: member.role,
      recordCount: member.recordCount,
      joinedAt: member.joinedAt,
    })),
  });
}
