import { NextResponse } from "next/server";
import { getRequestUserId } from "../../../../../lib/platform/request";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const bodyUserId = body?.user_id as string | undefined;
  const headerUserId = getRequestUserId(request);
  const userId = bodyUserId ?? headerUserId;

  if (!userId) {
    return NextResponse.json({ error: "user_id is required" }, { status: 400 });
  }

  return NextResponse.json({ user_id: userId });
}
