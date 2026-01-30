import { NextResponse } from "next/server";
import { addCredential, listCredentials, type CredentialType } from "../../../../../lib/talisman/credentials";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const personId = searchParams.get("person_id") ?? undefined;
  const credentials = await listCredentials(personId);
  return NextResponse.json({ credentials });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const personId = body?.person_id as string | undefined;
  const type = body?.type as CredentialType | undefined;
  const rawValue = body?.raw_value as string | undefined;
  const issuer = body?.issuer as string | undefined;

  if (!type || !rawValue || !issuer) {
    return NextResponse.json(
      { error: "type, raw_value, issuer are required" },
      { status: 400 }
    );
  }

  try {
    const credential = await addCredential({
      personId,
      type,
      rawValue,
      issuer,
    });
    return NextResponse.json({
      credential_id: credential.credentialId,
      person_id: credential.personId,
      type: credential.type,
      normalized_hash: credential.normalizedHash,
      issuer: credential.issuer,
      issued_at: credential.issuedAt,
      revoked_at: credential.revokedAt ?? null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to add credential";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
