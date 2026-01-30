import { NextResponse } from "next/server";
import { getRequestUserId } from "../../../../../lib/platform/request";
import { getScoutConversation } from "../../../../../lib/epoch/scouts";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: { scoutId: string } }
) {
  const userId = getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const conversation = await getScoutConversation({
    scoutId: params.scoutId,
    userId,
  });

  if (!conversation) {
    return NextResponse.json({ error: "Scout not found" }, { status: 404 });
  }

  return NextResponse.json({ conversation });
}
