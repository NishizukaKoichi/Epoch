import { NextResponse } from "next/server";
import { updateSpellStatus, type SpellStatus } from "../../../../../../../lib/spell/spells";
import { recordAuditEvent } from "../../../../../../../lib/spell/audit";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  context: { params: { spellId: string } }
) {
  const spellId = context.params.spellId;
  if (!spellId) {
    return NextResponse.json({ error: "spell_id is required" }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const status = body?.status as SpellStatus | undefined;
  if (!status || !["active", "inactive"].includes(status)) {
    return NextResponse.json({ error: "status must be active or inactive" }, { status: 400 });
  }

  try {
    await updateSpellStatus({ spellId, status });
    await recordAuditEvent({
      eventName: "spell_status_updated",
      targetId: spellId,
      metadata: { status },
    });
    return NextResponse.json({ status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update spell";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
