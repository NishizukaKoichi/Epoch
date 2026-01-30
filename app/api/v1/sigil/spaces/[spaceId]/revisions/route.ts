import { NextResponse } from "next/server";
import { createSpaceRevision, getSpace } from "../../../../../../../lib/sigil/spaces";
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

  const space = await getSpace(spaceId, userId);
  if (!space) {
    return NextResponse.json({ error: "Space not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const title = body?.title as string | undefined;
  const purpose = body?.purpose as string | undefined;

  if (!title || !purpose) {
    return NextResponse.json({ error: "title and purpose are required" }, { status: 400 });
  }

  try {
    const revision = await createSpaceRevision({
      spaceId,
      authorUserId: userId,
      title,
      purpose,
    });
    return NextResponse.json({ revision });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create revision";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
