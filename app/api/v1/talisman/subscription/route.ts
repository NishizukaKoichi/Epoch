import { NextResponse } from "next/server";
import { getSubscription, upsertSubscription } from "../../../../../lib/talisman/subscription";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const personId = searchParams.get("person_id");
  if (!personId) {
    return NextResponse.json({ error: "person_id is required" }, { status: 400 });
  }

  const subscription = await getSubscription(personId);
  if (!subscription) {
    return NextResponse.json({ subscription: null });
  }
  return NextResponse.json({
    subscription: {
      person_id: subscription.personId,
      plan_id: subscription.planId,
      updated_at: subscription.updatedAt,
    },
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const personId = body?.person_id as string | undefined;
  const planId = body?.plan_id as string | undefined;

  if (!personId || !planId) {
    return NextResponse.json(
      { error: "person_id and plan_id are required" },
      { status: 400 }
    );
  }

  try {
    const subscription = await upsertSubscription({ personId, planId });
    return NextResponse.json({
      subscription: {
        person_id: subscription.personId,
        plan_id: subscription.planId,
        updated_at: subscription.updatedAt,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update subscription";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
