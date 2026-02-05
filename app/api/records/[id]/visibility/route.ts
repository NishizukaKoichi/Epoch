import { NextResponse } from "next/server";
import { createVisibilityChangeRecord } from "../../../../../lib/epoch-records";
import { audit } from "../../../../../lib/audit";
import { getServerUserId } from "../../../../../lib/auth/server";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const isProduction = process.env.NODE_ENV === "production";
  const body = await request.json();
  const authUserId = await getServerUserId();
  const bodyUserId = body?.userId as string | undefined;
  const visibility = body?.visibility as "private" | "scout_visible" | "public" | undefined;

  if (!authUserId && isProduction) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (authUserId && bodyUserId && authUserId !== bodyUserId) {
    return NextResponse.json({ error: "User mismatch" }, { status: 403 });
  }

  const userId = authUserId ?? bodyUserId;
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
