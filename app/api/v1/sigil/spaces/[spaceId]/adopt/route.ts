import { NextResponse } from "next/server";
import { upsertAdoption, type AdoptionStatus } from "../../../../../../../lib/sigil/adoptions";
import { getPublicSpace, getSpace } from "../../../../../../../lib/sigil/spaces";
import { getRequestUserId } from "../../../../../../../lib/platform/request";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  context: { params: { spaceId: string } }
) {
  const userId = getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const spaceId = context.params.spaceId;
  if (!spaceId) {
    return NextResponse.json({ error: "space_id is required" }, { status: 400 });
  }

  const space = await getPublicSpace(spaceId);
  if (!space) {
    const owned = await getSpace(spaceId, userId);
    if (!owned) {
      return NextResponse.json({ error: "Space not found" }, { status: 404 });
    }
  }

  const body = await request.json().catch(() => ({}));
  const status = body?.status as AdoptionStatus | undefined;
  if (!status || !["accepted", "declined"].includes(status)) {
    return NextResponse.json({ error: "status must be accepted or declined" }, { status: 400 });
  }

  try {
    const adoption = await upsertAdoption({ spaceId, userId, status });
    return NextResponse.json({ adoption });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to record adoption";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
