import { NextResponse } from "next/server";
import { getRequestUserId } from "../../../../../../lib/platform/request";
import { addScoutMessage } from "../../../../../../lib/epoch/scouts";
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

  const body = await request.json();
  const content = body?.content as string | undefined;
  if (!content) {
    return NextResponse.json({ error: "content is required" }, { status: 400 });
  }

  try {
    const conversation = await addScoutMessage({
      scoutId: params.scoutId,
      userId,
      content,
    });
    await audit("scout_message_sent", {
      actorUserId: userId,
      scoutId: params.scoutId,
      details: "scout_message_sent",
    });
    return NextResponse.json({ conversation });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send message";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
