import { NextResponse } from "next/server";
import { createScope, listScopes } from "../../../../../lib/spell/scopes";
import { recordAuditEvent } from "../../../../../lib/spell/audit";

export const runtime = "nodejs";

export async function GET() {
  const scopes = await listScopes();
  return NextResponse.json({ scopes });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const scopeKey = body?.scope_key as string | undefined;
  const description = body?.description as string | undefined;

  if (!scopeKey || !description) {
    return NextResponse.json({ error: "scope_key and description are required" }, { status: 400 });
  }

  try {
    const scope = await createScope({ scopeKey, description });
    await recordAuditEvent({
      eventName: "scope_created",
      targetId: scope.scopeKey,
    });
    return NextResponse.json({ scope });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create scope";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
