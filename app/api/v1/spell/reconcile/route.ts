import { NextResponse } from "next/server";
import { reconcileStripeEvents } from "../../../../../lib/spell/stripe";

export const runtime = "nodejs";

export async function POST() {
  try {
    const result = await reconcileStripeEvents();
    return NextResponse.json({ status: "ok", processed: result.processed });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to reconcile";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
