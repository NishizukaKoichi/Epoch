import { NextResponse } from "next/server";
import { issueArtifact } from "../../../../../lib/sigil/issues";
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
  const revisionId = body?.revision_id as string | undefined;
  const subjectUserId = body?.subject_user_id as string | undefined;

  if (!spaceId || !revisionId || !subjectUserId) {
    return NextResponse.json(
      { error: "space_id, revision_id, subject_user_id are required" },
      { status: 400 }
    );
  }

  const space = await getSpace(spaceId, userId);
  if (!space) {
    return NextResponse.json({ error: "Space not found" }, { status: 404 });
  }

  try {
    const artifact = await issueArtifact({
      spaceId,
      revisionId,
      subjectUserId,
    });
    return NextResponse.json({ artifact });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to issue";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
