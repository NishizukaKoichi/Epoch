import { NextResponse } from "next/server";
import { getChapter, listChapters } from "../../../../../../lib/sigil/chapters";
import { getPublicSpace } from "../../../../../../lib/sigil/spaces";
import { getRequestUserId } from "../../../../../../lib/platform/request";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  context: { params: { chapterId: string } }
) {
  const chapterId = context.params.chapterId;
  if (!chapterId) {
    return NextResponse.json({ error: "chapter_id is required" }, { status: 400 });
  }

  const chapter = await getChapter(chapterId);
  if (!chapter) {
    return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
  }

  const userId = getRequestUserId(request);
  if (!userId) {
    const publicSpace = await getPublicSpace(chapter.spaceId);
    if (!publicSpace) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const chapters = await listChapters(chapter.spaceId);
  const matching = chapters.find((item) => item.chapterId === chapterId);
  return NextResponse.json({ chapter: matching ?? chapter });
}
