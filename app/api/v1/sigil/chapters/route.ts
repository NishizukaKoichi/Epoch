import { NextResponse } from "next/server";
import { createChapter } from "../../../../../lib/sigil/chapters";
import { getSpace } from "../../../../../lib/sigil/spaces";
import { getRequestUserId } from "../../../../../lib/platform/request";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const userId = getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const spaceId = body?.space_id as string | undefined;
  const orderIndex = body?.order_index as number | undefined;
  const title = body?.title as string | undefined;
  const bodyText = body?.body as string | undefined;

  if (!spaceId || orderIndex === undefined || !title || !bodyText) {
    return NextResponse.json(
      { error: "space_id, order_index, title, body are required" },
      { status: 400 }
    );
  }

  const space = await getSpace(spaceId, userId);
  if (!space) {
    return NextResponse.json({ error: "Space not found" }, { status: 404 });
  }

  try {
    const chapter = await createChapter({
      spaceId,
      orderIndex,
      title,
      body: bodyText,
      authorUserId: userId,
    });
    return NextResponse.json({ chapter });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create chapter";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
