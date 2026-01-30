import { NextResponse } from "next/server";
import { listEntitlements } from "../../../../../lib/spell/entitlements";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const spellId = searchParams.get("spell_id") ?? undefined;
  const userIdentifier = searchParams.get("user_identifier") ?? undefined;
  const status = searchParams.get("status") as "active" | "revoked" | null;

  const entitlements = await listEntitlements({
    spellId,
    userIdentifier,
    status: status ?? undefined,
  });
  return NextResponse.json({ entitlements });
}
