const DEMO_TOKEN_HASH_KEY = "demo_token";

export function readDemoTokenFromHash(hash: string): string | null {
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!raw) return null;

  const params = new URLSearchParams(raw);
  const token = params.get(DEMO_TOKEN_HASH_KEY)?.trim();
  return token || null;
}

export function clearDemoTokenHash(): void {
  if (typeof window === "undefined") return;
  const { pathname, search } = window.location;
  window.history.replaceState(null, "", `${pathname}${search}`);
}
