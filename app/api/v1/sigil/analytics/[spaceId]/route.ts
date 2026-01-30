import { NextResponse } from "next/server";
import { getAnalytics } from "../../../../../../lib/sigil/analytics";
import { getSpace } from "../../../../../../lib/sigil/spaces";
import { getRequestUserId } from "../../../../../../lib/platform/request";

export const runtime = "nodejs";

export async function GET(
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

  const analytics = await getAnalytics(spaceId);
  return NextResponse.json({ analytics });
}
