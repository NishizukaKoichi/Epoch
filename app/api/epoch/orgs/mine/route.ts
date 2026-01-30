import { NextResponse } from "next/server";
import { getRequestUserId } from "../../../../../lib/platform/request";
import { listUserOrganizations } from "../../../../../lib/epoch/orgs";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const userId = getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orgs = await listUserOrganizations(userId);
  return NextResponse.json({ orgs });
}
