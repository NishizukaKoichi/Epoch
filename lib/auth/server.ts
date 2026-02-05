import { cookies, headers } from "next/headers";

const FALLBACK_USER_ID = process.env.DEFAULT_USER_ID ?? null;

const AUTH_COOKIE_REGEX = /^sb-[a-z0-9-]+-auth-token(\.\d+)?$/i;

type AuthSession = {
  user?: {
    id?: string;
  };
};

function decodeSupabaseSession(rawValue: string): AuthSession | null {
  let value = rawValue;
  if (value.startsWith("base64-")) {
    value = value.slice("base64-".length);
    try {
      value = Buffer.from(value, "base64").toString("utf8");
    } catch {
      return null;
    }
  }

  try {
    return JSON.parse(value) as AuthSession;
  } catch {
    return null;
  }
}

function extractSupabaseUserId(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  const allCookies = cookieStore.getAll();
  const authCookies = allCookies.filter((cookie) => AUTH_COOKIE_REGEX.test(cookie.name));
  if (authCookies.length === 0) return null;

  const grouped = new Map<string, { index: number; value: string }[]>();
  for (const cookie of authCookies) {
    const match = cookie.name.match(/^(sb-[a-z0-9-]+-auth-token)(?:\.(\d+))?$/i);
    if (!match) continue;
    const base = match[1];
    const index = match[2] ? Number(match[2]) : 0;
    const entry = grouped.get(base) ?? [];
    entry.push({ index, value: cookie.value });
    grouped.set(base, entry);
  }

  for (const [, chunks] of grouped) {
    const ordered = [...chunks].sort((a, b) => a.index - b.index);
    const joined = ordered.map((chunk) => chunk.value).join("");
    const session = decodeSupabaseSession(joined);
    if (session?.user?.id) return session.user.id;
  }

  return null;
}

export async function getServerUserId(): Promise<string | null> {
  const headerStore = await headers();
  const cookieStore = await cookies();
  const header = headerStore.get("x-user-id") ?? headerStore.get("x-user");
  if (header && header.length > 0) {
    return header;
  }

  const cookie = cookieStore.get("x-user-id")?.value ?? cookieStore.get("user_id")?.value;
  if (cookie && cookie.length > 0) {
    return cookie;
  }

  const supabaseUserId = extractSupabaseUserId(cookieStore);
  if (supabaseUserId) return supabaseUserId;

  return FALLBACK_USER_ID;
}
