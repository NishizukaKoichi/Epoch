import { NextResponse } from "next/server";
import { getSpell } from "../../../../../../lib/spell/spells";
import { listSpellScopes } from "../../../../../../lib/spell/scopes";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: { spellId: string } }
) {
  const spellId = context.params.spellId;
  if (!spellId) {
    return NextResponse.json({ error: "spell_id is required" }, { status: 400 });
  }

  const spell = await getSpell(spellId);
  if (!spell) {
    return NextResponse.json({ error: "Spell not found" }, { status: 404 });
  }

  const scopes = await listSpellScopes(spellId);
  return NextResponse.json({ spell: { ...spell, scopes } });
}
