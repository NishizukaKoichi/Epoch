import { NextResponse } from "next/server";
import { getRequestUserId } from "../../../../lib/platform/request";
import { getProfile, upsertProfile } from "../../../../lib/epoch/profiles";
import { audit } from "../../../../lib/audit";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const userId = getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await getProfile(userId);
  return NextResponse.json({ profile });
}

export async function POST(request: Request) {
  const userId = getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const profile = await upsertProfile({
    userId,
    displayName: typeof body?.displayName === "string" ? body.displayName : null,
    bio: typeof body?.bio === "string" ? body.bio : null,
    avatarUrl: typeof body?.avatarUrl === "string" ? body.avatarUrl : null,
    profession: typeof body?.profession === "string" ? body.profession : null,
    region: typeof body?.region === "string" ? body.region : null,
    scoutVisible: body?.scoutVisible === false ? false : true,
    links: Array.isArray(body?.links) ? body.links : [],
  });

  await audit("profile_updated", {
    actorUserId: userId,
    details: "profile_updated",
  });

  return NextResponse.json({ profile });
}
