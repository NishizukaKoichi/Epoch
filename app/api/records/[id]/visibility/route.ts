import { NextResponse } from "next/server";
import { createVisibilityChangeRecord } from "../../../../../lib/epoch-records";
import { audit } from "../../../../../lib/audit";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const userId = body?.userId as string | undefined;
  const visibility = body?.visibility as "private" | "scout_visible" | "public" | undefined;

  if (!userId || !visibility) {
    return NextResponse.json(
      { error: "userId and visibility are required" },
      { status: 400 }
    );
  }

  try {
    const record = await createVisibilityChangeRecord({
      userId,
      targetRecordId: params.id,
      visibility,
    });

    await audit("visibility_changed", {
      actorUserId: userId,
      details: visibility,
      recordId: params.id,
    });

    return NextResponse.json({ record });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to change visibility";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
