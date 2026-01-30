import { NextResponse } from "next/server";
import { getRequestUserId } from "../../../../../lib/platform/request";
import { getScoutSettings, saveScoutSettings } from "../../../../../lib/epoch/settings";
import { audit } from "../../../../../lib/audit";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const userId = getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await getScoutSettings(userId);
  return NextResponse.json({ settings });
}

export async function POST(request: Request) {
  const userId = getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const settings = await saveScoutSettings(userId, {
    enabled: body?.enabled !== false,
    maxPerMonth: Number.isFinite(body?.maxPerMonth) ? body.maxPerMonth : 10,
    selectedIndustries: Array.isArray(body?.selectedIndustries) ? body.selectedIndustries : [],
    minCompanySize: Number.isFinite(body?.minCompanySize) ? body.minCompanySize : 0,
    excludeKeywords: Array.isArray(body?.excludeKeywords) ? body.excludeKeywords : [],
    requireJobDescription: body?.requireJobDescription !== false,
    requireSalaryRange: body?.requireSalaryRange === true,
  });

  await audit("scout_settings_updated", {
    actorUserId: userId,
    details: "scout_settings_updated",
  });

  return NextResponse.json({ settings });
}
