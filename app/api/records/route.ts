import { NextResponse } from "next/server";
import { createEpochRecord } from "../../../lib/epoch-records";
import { ensureProfile } from "../../../lib/epoch/profiles";
import { audit } from "../../../lib/audit";
import { getServerUserId } from "../../../lib/auth/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const isProduction = process.env.NODE_ENV === "production";
  const body = await request.json();
  const authUserId = await getServerUserId();
  const bodyUserId = body?.userId as string | undefined;
  const recordType = body?.recordType as string | undefined;
  const payload = body?.payload as Record<string, unknown> | unknown[] | undefined;
  const visibility = body?.visibility as string | undefined;
  const attachments = body?.attachments as
    | { attachmentHash: string; storagePointer: string }[]
    | undefined;

  if (!authUserId && isProduction) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (authUserId && bodyUserId && authUserId !== bodyUserId) {
    return NextResponse.json({ error: "User mismatch" }, { status: 403 });
  }

  const userId = authUserId ?? bodyUserId;

  if (!userId || !recordType || payload === undefined) {
    return NextResponse.json(
      { error: "userId, recordType, and payload are required" },
      { status: 400 }
    );
  }

  try {
    await ensureProfile(userId);
    const record = await createEpochRecord({
      userId,
      recordType,
      payload,
      visibility,
      attachments,
    });

    await audit("record_created", {
      actorUserId: userId,
      details: recordType,
      recordId: record.recordId,
    });

    return NextResponse.json({ record });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create record";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
