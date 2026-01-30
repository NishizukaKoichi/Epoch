import { NextResponse } from "next/server";
import { getRequestUserId } from "../../../../../../lib/platform/request";
import { getOrganizationRole, listOrganizationActivity } from "../../../../../../lib/epoch/orgs";

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

  const { searchParams } = new URL(request.url);
  const limitParam = Number(searchParams.get("limit") ?? "10");
  const limit = Number.isFinite(limitParam) ? Math.max(1, Math.min(limitParam, 20)) : 10;

  const activities = await listOrganizationActivity(orgId, limit);
  return NextResponse.json({ activities });
}
