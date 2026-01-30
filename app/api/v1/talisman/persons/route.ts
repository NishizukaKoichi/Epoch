import { NextResponse } from "next/server";
import { createPerson } from "../../../../../lib/talisman/persons";

export const runtime = "nodejs";

export async function POST() {
  try {
    const person = await createPerson();
    return NextResponse.json({ person_id: person.personId, created_at: person.createdAt });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create person";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
