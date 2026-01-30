import { NextResponse } from "next/server";
import { verifyStripeWebhook } from "../../../../../../lib/stripe";
import { recordStripeEvent, markStripeEventProcessed, processStripeEvent } from "../../../../../../lib/spell/stripe";
import { recordAuditEvent } from "../../../../../../lib/spell/audit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature");

  try {
    const event = verifyStripeWebhook(payload, signature);
    const inserted = await recordStripeEvent({ eventId: event.id, rawPayload: payload });
    if (!inserted) {
      return NextResponse.json({ status: "ignored" });
    }

    await processStripeEvent(event);
    await markStripeEventProcessed(event.id);
    await recordAuditEvent({
      eventName: "stripe_event_processed",
      metadata: { eventId: event.id, eventType: event.type },
    });

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
