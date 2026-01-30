import { NextResponse } from "next/server";
import { revokeDeveloperKey } from "../../../../../../lib/platform/keys";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  context: { params: { keyId: string } }
) {
  const body = await request.json().catch(() => ({}));
  const ownerUserId = body?.owner_user_id as string | undefined;
  const keyId = context.params.keyId;

  if (!ownerUserId || !keyId) {
    return NextResponse.json(
      { error: "owner_user_id and key_id are required" },
      { status: 400 }
    );
  }

  try {
    await revokeDeveloperKey({ ownerUserId, keyId });
    return NextResponse.json({ status: "revoked" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to revoke developer key";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
