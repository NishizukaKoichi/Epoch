import { NextResponse } from "next/server";
import { getRequestUserId } from "../../../../../../lib/platform/request";
import { declineScout } from "../../../../../../lib/epoch/scouts";
import { audit } from "../../../../../../lib/audit";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: { scoutId: string } }
) {
  const userId = getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const conversation = await declineScout({ scoutId: params.scoutId, userId });
    await audit("scout_declined", {
      actorUserId: userId,
      scoutId: params.scoutId,
      details: "scout_declined",
    });
    return NextResponse.json({ conversation });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to decline scout";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
