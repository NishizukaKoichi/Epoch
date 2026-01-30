import { NextResponse } from "next/server";
import { createSpell, listSpells, type SpellType } from "../../../../../lib/spell/spells";
import { attachScopesToSpell } from "../../../../../lib/spell/scopes";
import { recordAuditEvent } from "../../../../../lib/spell/audit";

export const runtime = "nodejs";

export async function GET() {
  const spells = await listSpells();
  return NextResponse.json({ spells });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const name = body?.name as string | undefined;
  const sku = body?.sku as string | undefined;
  const type = body?.type as SpellType | undefined;
  const status = body?.status as "active" | "inactive" | undefined;
  const stripeProductId = body?.stripe_product_id as string | undefined;
  const stripePriceId = body?.stripe_price_id as string | undefined;
  const scopes = (body?.scopes as string[] | undefined) ?? [];

  if (!name || !sku || !type) {
    return NextResponse.json({ error: "name, sku, type are required" }, { status: 400 });
  }

  try {
    const spell = await createSpell({
      name,
      sku,
      type,
      status,
      stripeProductId,
      stripePriceId,
    });

    if (scopes.length > 0) {
      await attachScopesToSpell({ spellId: spell.spellId, scopes });
    }

    await recordAuditEvent({
      eventName: "spell_created",
      targetId: spell.spellId,
      metadata: { sku, scopes },
    });

    return NextResponse.json({ spell });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create spell";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
