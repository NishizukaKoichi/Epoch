import { NextResponse } from "next/server";
import { getRequestUserId } from "../../../../lib/platform/request";
import { createScout, listScoutsForUser } from "../../../../lib/epoch/scouts";
import { audit } from "../../../../lib/audit";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const userId = getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const scouts = await listScoutsForUser(userId);
  return NextResponse.json(scouts);
}

export async function POST(request: Request) {
  const userId = getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const targetUserId = body?.targetUserId as string | undefined;

  if (!targetUserId) {
    return NextResponse.json({ error: "targetUserId is required" }, { status: 400 });
  }

  try {
    const conversation = await createScout({
      initiatorUserId: userId,
      targetUserId,
      initiatorOrgName:
        typeof body?.initiatorOrgName === "string" ? body.initiatorOrgName : null,
      initiatorRole: typeof body?.initiatorRole === "string" ? body.initiatorRole : null,
      projectSummary:
        typeof body?.projectSummary === "string" ? body.projectSummary : null,
    });

    await audit("scout_sent", {
      actorUserId: userId,
      targetUserId,
      scoutId: conversation.id,
      details: "scout_sent",
    });

    return NextResponse.json({ conversation });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send scout";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
