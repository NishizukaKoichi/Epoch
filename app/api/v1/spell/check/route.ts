import { NextResponse } from "next/server";
import { getBearerToken } from "../../../../../lib/platform/request";
import { verifyAccessToken } from "../../../../../lib/platform/tokens";
import { recordMeterEvent } from "../../../../../lib/platform/meter";
import { hasActiveEntitlement } from "../../../../../lib/spell/entitlements";
import { isScopeAllowedForSpell } from "../../../../../lib/spell/scopes";
import { recordScopeCheck } from "../../../../../lib/spell/checks";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const token = getBearerToken(request);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let keyId: string;
  let scopes: string[];
  try {
    const verified = await verifyAccessToken(token);
    keyId = verified.keyId;
    scopes = verified.scopes;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }

  if (!scopes.includes("spell.check")) {
    return NextResponse.json({ error: "Scope denied" }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const spellId = body?.spell_id as string | undefined;
  const runtimeId = body?.runtime_id as string | undefined;
  const userIdentifier = body?.user_identifier as string | undefined;
  const requestedScope = body?.requested_scope as string | undefined;

  if (!spellId || !runtimeId || !userIdentifier || !requestedScope) {
    return NextResponse.json(
      { error: "spell_id, runtime_id, user_identifier, requested_scope are required" },
      { status: 400 }
    );
  }

  const scopeAllowed = await isScopeAllowedForSpell({
    spellId,
    scopeKey: requestedScope,
  });
  const entitled = scopeAllowed
    ? await hasActiveEntitlement({ spellId, userIdentifier })
    : false;
  const allowed = scopeAllowed && entitled;

  await recordScopeCheck({
    spellId,
    runtimeId,
    userIdentifier,
    requestedScope,
    allowed,
  });
  await recordMeterEvent({ keyId, scope: "spell.check" });

  if (!allowed) {
    return NextResponse.json({ error: "Entitlement denied" }, { status: 403 });
  }

  return NextResponse.json({ allowed: true });
}
