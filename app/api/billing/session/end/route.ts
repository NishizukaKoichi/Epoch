import { NextResponse } from "next/server";
import { audit } from "../../../../../lib/audit";
import { track } from "../../../../../lib/analytics";
import { endReadGrant } from "../../../../../lib/read-access";
import { getServerUserId } from "../../../../../lib/auth/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const isProduction = process.env.NODE_ENV === "production";
  const body = await request.json();
  const authUserId = await getServerUserId();
  const bodyViewerId = body?.userId as string | undefined;
  const grantId = body?.grantId as string | undefined;

  if (!authUserId && isProduction) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (authUserId && bodyViewerId && authUserId !== bodyViewerId) {
    return NextResponse.json({ error: "Viewer mismatch" }, { status: 403 });
  }

  const viewerId = authUserId ?? bodyViewerId;
  if (!viewerId || !grantId) {
    return NextResponse.json(
      { error: "userId and grantId are required" },
      { status: 400 }
    );
  }

  const grant = await endReadGrant({ viewerId, grantId });
  if (!grant) {
    return NextResponse.json({ error: "Read grant not found" }, { status: 404 });
  }

  if (grant.type === "time_window") {
    track("time_window_ended", { viewerId, grantId });
    await audit("time_window_ended", { viewerId, grantId });
  } else {
    track("read_session_ended", { viewerId, grantId });
    await audit("read_session_ended", { viewerId, grantId });
  }

  return NextResponse.json({ grant });
}
