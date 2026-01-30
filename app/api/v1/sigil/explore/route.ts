import { NextResponse } from "next/server";
import { listPublicSpaces } from "../../../../../lib/sigil/spaces";

export const runtime = "nodejs";

export async function GET() {
  const spaces = await listPublicSpaces();
  return NextResponse.json({ spaces });
}
