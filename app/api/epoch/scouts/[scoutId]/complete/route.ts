import { NextResponse } from "next/server";
import { getRequestUserId } from "../../../../../../lib/platform/request";
import { completeScout } from "../../../../../../lib/epoch/scouts";
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
    const conversation = await completeScout({ scoutId: params.scoutId, userId });
    await audit("scout_completed", {
      actorUserId: userId,
      scoutId: params.scoutId,
      details: "scout_completed",
    });
    return NextResponse.json({ conversation });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to complete scout";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
