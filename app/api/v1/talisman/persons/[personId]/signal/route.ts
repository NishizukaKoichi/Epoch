import { NextResponse } from "next/server";
import { getSignal } from "../../../../../../../lib/talisman/signal";
import { getPerson } from "../../../../../../../lib/talisman/persons";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: { personId: string } }
) {
  const personId = context.params.personId;
  if (!personId) {
    return NextResponse.json({ error: "person_id is required" }, { status: 400 });
  }

  const person = await getPerson(personId);
  if (!person) {
    return NextResponse.json({ error: "person not found" }, { status: 404 });
  }

  const signal = await getSignal(personId);
  return NextResponse.json({
    person_id: personId,
    score: signal.score,
    flags: signal.flags,
  });
}
