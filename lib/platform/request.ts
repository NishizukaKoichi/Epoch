export function getBearerToken(request: Request): string | null {
  const header = request.headers.get("authorization") ?? request.headers.get("Authorization");
  if (!header) {
    return null;
  }
  const [scheme, value] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !value) {
    return null;
  }
  return value.trim();
}

export function getRequestUserId(request: Request): string | null {
  const header =
    request.headers.get("x-user-id") ??
    request.headers.get("x-user");
  if (!header) {
    return null;
  }
  const value = header.trim();
  return value.length > 0 ? value : null;
}
