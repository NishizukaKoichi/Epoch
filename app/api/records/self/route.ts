import { NextResponse } from "next/server";
import { listRecordsForUser } from "../../../../lib/epoch-records";
import { getServerUserId } from "../../../../lib/auth/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const isProduction = process.env.NODE_ENV === "production";
  const authUserId = await getServerUserId();
  const { searchParams } = new URL(request.url);
  const queryUserId = searchParams.get("userId");

  if (!authUserId && isProduction) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (authUserId && queryUserId && authUserId !== queryUserId) {
    return NextResponse.json({ error: "User mismatch" }, { status: 403 });
  }

  const userId = authUserId ?? queryUserId;
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const records = await listRecordsForUser(userId);
  return NextResponse.json({ records });
}
