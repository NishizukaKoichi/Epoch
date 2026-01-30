import { NextResponse } from "next/server";
import { getProfile } from "../../../../../lib/epoch/profiles";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: { userId: string } }
) {
  const profile = await getProfile(params.userId);
  if (!profile) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user: profile });
}
