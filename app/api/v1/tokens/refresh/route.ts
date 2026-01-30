import { NextResponse } from "next/server";
import { refreshAccessToken } from "../../../../../lib/platform/tokens";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const refreshToken = body?.refresh_token as string | undefined;
  if (!refreshToken) {
    return NextResponse.json({ error: "refresh_token is required" }, { status: 400 });
  }

  try {
    const access = await refreshAccessToken({ refreshToken });
    return NextResponse.json({
      access_token: access.accessToken,
      expires_at: access.expiresAt,
      scopes: access.scopes,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to refresh token";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
