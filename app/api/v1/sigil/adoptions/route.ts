import { NextResponse } from "next/server";
import { listAdoptions } from "../../../../../lib/sigil/adoptions";
import { getRequestUserId } from "../../../../../lib/platform/request";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const userId = getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adoptions = await listAdoptions(userId);
  return NextResponse.json({ adoptions });
}
