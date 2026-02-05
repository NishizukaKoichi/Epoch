import { NextResponse } from "next/server";
import { getEntitlement } from "../../../../../lib/entitlements";
import { audit } from "../../../../../lib/audit";
import { track } from "../../../../../lib/analytics";
import { startReadGrant, type ReadAccessType } from "../../../../../lib/read-access";
import { getServerUserId } from "../../../../../lib/auth/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const isProduction = process.env.NODE_ENV === "production";
  const body = await request.json();
  const authUserId = await getServerUserId();
  const bodyViewerId = body?.userId as string | undefined;
  const targetUserId = body?.targetUserId as string | undefined;
  const type = body?.type as ReadAccessType | undefined;
  const hasOverrides =
    body?.windowStart !== undefined ||
    body?.windowEnd !== undefined ||
    body?.durationMinutes !== undefined;

  if (!authUserId && isProduction) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (authUserId && bodyViewerId && authUserId !== bodyViewerId) {
    return NextResponse.json({ error: "Viewer mismatch" }, { status: 403 });
  }

  const viewerId = authUserId ?? bodyViewerId;
  if (!viewerId || !targetUserId || !type) {
    return NextResponse.json(
      { error: "userId, targetUserId, and type are required" },
      { status: 400 }
    );
  }

  if (viewerId === targetUserId) {
    return NextResponse.json(
      { error: "Self reads do not require a read session" },
      { status: 400 }
    );
  }

  if (hasOverrides) {
    return NextResponse.json(
      { error: "Read grant parameters are fixed in v1" },
      { status: 400 }
    );
  }

  const entitlement = await getEntitlement(viewerId);
  if (!entitlement || entitlement.status !== "active") {
    return NextResponse.json({ error: "Active entitlement required" }, { status: 403 });
  }

  if (entitlement.planKey !== type) {
    return NextResponse.json(
      { error: "Entitlement plan does not match read type" },
      { status: 403 }
    );
  }

  try {
    const grant = await startReadGrant({
      viewerId,
      targetUserId,
      type,
    });

    if (type === "time_window") {
      track("time_window_started", { viewerId, targetUserId, grantId: grant.grantId });
      await audit("time_window_started", {
        viewerId,
        targetUserId,
        grantId: grant.grantId,
      });
    } else {
      track("read_session_started", { viewerId, targetUserId, grantId: grant.grantId });
      await audit("read_session_started", {
        viewerId,
        targetUserId,
        grantId: grant.grantId,
      });
    }

    return NextResponse.json({ grant });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to start read session";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
