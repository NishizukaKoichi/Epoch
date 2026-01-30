import { NextResponse } from "next/server";
import { getRequestUserId } from "../../../../../../lib/platform/request";
import { acceptScout } from "../../../../../../lib/epoch/scouts";
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
    const conversation = await acceptScout({ scoutId: params.scoutId, userId });
    await audit("scout_accepted", {
      actorUserId: userId,
      scoutId: params.scoutId,
      details: "scout_accepted",
    });
    return NextResponse.json({ conversation });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to accept scout";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
