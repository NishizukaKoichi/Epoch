import { NextResponse } from "next/server";
import { createChapterRevision, getChapter } from "../../../../../../../lib/sigil/chapters";
import { getSpace } from "../../../../../../../lib/sigil/spaces";
import { getRequestUserId } from "../../../../../../../lib/platform/request";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  context: { params: { chapterId: string } }
) {
  const userId = getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const chapterId = context.params.chapterId;
  if (!chapterId) {
    return NextResponse.json({ error: "chapter_id is required" }, { status: 400 });
  }

  const chapter = await getChapter(chapterId);
  if (!chapter) {
    return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
  }
  const space = await getSpace(chapter.spaceId, userId);
  if (!space) {
    return NextResponse.json({ error: "Space not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const title = body?.title as string | undefined;
  const bodyText = body?.body as string | undefined;

  if (!title || !bodyText) {
    return NextResponse.json({ error: "title and body are required" }, { status: 400 });
  }

  try {
    const revision = await createChapterRevision({
      chapterId,
      title,
      body: bodyText,
      authorUserId: userId,
    });
    return NextResponse.json({ revision });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create revision";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
