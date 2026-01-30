import { NextResponse } from "next/server";
import { getArtifact, verifySignature } from "../../../../../lib/sigil/issues";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const signature = body?.signature as string | undefined;
  const artifactId = body?.artifact_id as string | undefined;
  const spaceId = body?.space_id as string | undefined;
  const revisionId = body?.revision_id as string | undefined;
  const subjectUserId = body?.subject_user_id as string | undefined;

  if (!signature) {
    return NextResponse.json({ error: "signature is required" }, { status: 400 });
  }

  try {
    if (artifactId) {
      const artifact = await getArtifact(artifactId);
      if (!artifact) {
        return NextResponse.json({ valid: false, error: "artifact not found" }, { status: 404 });
      }
      const valid = verifySignature({
        spaceId: artifact.spaceId,
        revisionId: artifact.revisionId,
        subjectUserId: artifact.subjectUserId,
        signature,
      });
      return NextResponse.json({ valid, artifact });
    }

    if (!spaceId || !revisionId || !subjectUserId) {
      return NextResponse.json(
        { error: "space_id, revision_id, subject_user_id are required" },
        { status: 400 }
      );
    }

    const valid = verifySignature({ spaceId, revisionId, subjectUserId, signature });
    return NextResponse.json({ valid });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Verification failed";
    return NextResponse.json({ valid: false, error: message }, { status: 400 });
  }
}
