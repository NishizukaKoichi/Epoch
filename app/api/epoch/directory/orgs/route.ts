import { NextResponse } from "next/server";
import { listPublicOrganizations } from "../../../../../lib/epoch/orgs";

export const runtime = "nodejs";

export async function GET() {
  const orgs = await listPublicOrganizations();
  return NextResponse.json({ orgs });
}
