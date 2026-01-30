import { NextResponse } from "next/server";
import { createSpace, listSpaces, type SpaceVisibility } from "../../../../../lib/sigil/spaces";
import { getRequestUserId } from "../../../../../lib/platform/request";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const userId = getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const spaces = await listSpaces(userId);
  return NextResponse.json({ spaces });
}

export async function POST(request: Request) {
  const userId = getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const title = body?.title as string | undefined;
  const purpose = body?.purpose as string | undefined;
  const visibility = body?.visibility as SpaceVisibility | undefined;

  if (!title || !purpose || !visibility) {
    return NextResponse.json({ error: "title, purpose, visibility are required" }, { status: 400 });
  }

  try {
    const space = await createSpace({
      ownerUserId: userId,
      title,
      purpose,
      visibility,
    });
    return NextResponse.json({ space });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create space";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
