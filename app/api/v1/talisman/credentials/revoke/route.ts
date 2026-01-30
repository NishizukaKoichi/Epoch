import { NextResponse } from "next/server";
import { revokeCredential } from "../../../../../../lib/talisman/credentials";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const credentialId = body?.credential_id as string | undefined;
  const actor = body?.actor as string | undefined;

  if (!credentialId) {
    return NextResponse.json({ error: "credential_id is required" }, { status: 400 });
  }

  try {
    await revokeCredential({ credentialId, actor });
    return NextResponse.json({ status: "revoked" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to revoke credential";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
