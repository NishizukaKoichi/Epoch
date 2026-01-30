import { NextResponse } from "next/server";
import { getRequestUserId } from "../../../../../lib/platform/request";
import { getSilenceSettings, saveSilenceSettings } from "../../../../../lib/epoch/settings";
import { audit } from "../../../../../lib/audit";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const userId = getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await getSilenceSettings(userId);
  return NextResponse.json({ settings });
}

export async function POST(request: Request) {
  const userId = getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const settings = await saveSilenceSettings(userId, {
    days: Number.isFinite(body?.days) ? body.days : 7,
    autoGenerate: body?.autoGenerate !== false,
  });

  await audit("silence_settings_updated", {
    actorUserId: userId,
    details: "silence_settings_updated",
  });

  return NextResponse.json({ settings });
}
