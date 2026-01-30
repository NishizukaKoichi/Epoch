import { NextResponse } from "next/server";
import { getRequestUserId } from "../../../../lib/platform/request";
import { audit } from "../../../../lib/audit";
import { createOrganization } from "../../../../lib/epoch/orgs";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const userId = getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const slug = typeof body?.slug === "string" ? body.slug.trim() : "";

  if (!name || !slug) {
    return NextResponse.json({ error: "name and slug are required" }, { status: 400 });
  }

  try {
    const org = await createOrganization({
      ownerUserId: userId,
      name,
      slug,
      allowMemberEpochAccess: Boolean(body?.allowMemberEpochAccess),
      requireApprovalForJoin: body?.requireApprovalForJoin !== false,
      isPublic: Boolean(body?.isPublic),
    });
    await audit("org_created", { actorUserId: userId, orgId: org.id, name: org.name });
    return NextResponse.json(
      {
        org: {
          id: org.id,
          name: org.name,
          slug: org.slug,
          role: "owner",
          memberCount: 1,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create organization";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
