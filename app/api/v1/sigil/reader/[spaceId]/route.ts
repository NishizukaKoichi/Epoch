import { NextResponse } from "next/server";
import { getSpaceById, getPublicSpace } from "../../../../../../lib/sigil/spaces";
import { listChapters } from "../../../../../../lib/sigil/chapters";
import { getRequestUserId } from "../../../../../../lib/platform/request";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  context: { params: { spaceId: string } }
) {
  const spaceId = context.params.spaceId;
  if (!spaceId) {
    return NextResponse.json({ error: "space_id is required" }, { status: 400 });
  }

  const userId = getRequestUserId(request);
  let space = await getPublicSpace(spaceId);

  if (!space && userId) {
    const owned = await getSpaceById(spaceId);
    if (owned && owned.ownerUserId === userId) {
      space = owned;
    }
  }

  if (!space) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const chapters = await listChapters(spaceId);
  return NextResponse.json({ space, chapters });
}
