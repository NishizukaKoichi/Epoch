import { NextResponse } from "next/server";
import { listPublicProfiles } from "../../../../../lib/epoch/profiles";

export const runtime = "nodejs";

export async function GET() {
  const users = await listPublicProfiles();
  return NextResponse.json({ users });
}
