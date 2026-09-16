import { cookies } from "next/headers";

import { supportAuthConfig } from "@/lib/auth/support-config";

export interface SupportAuthCookiePayload {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
}

export async function setSupportAuthCookies(
  payload: SupportAuthCookiePayload
): Promise<void> {
  const store = await cookies();
  const maxAge = payload.expiresAt
    ? Math.max(0, Math.floor((payload.expiresAt - Date.now()) / 1000))
    : 60 * 60 * 24 * 7;

  store.set(supportAuthConfig.cookieName, payload.accessToken, {
    httpOnly: true,
    secure: supportAuthConfig.secure,
    sameSite: supportAuthConfig.sameSite,
    path: "/",
    maxAge,
  });

  if (payload.refreshToken) {
    store.set(supportAuthConfig.refreshCookieName, payload.refreshToken, {
      httpOnly: true,
      secure: supportAuthConfig.secure,
      sameSite: supportAuthConfig.sameSite,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }
}

export async function getSupportAccessToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(supportAuthConfig.cookieName)?.value ?? null;
}

export async function getSupportRefreshToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(supportAuthConfig.refreshCookieName)?.value ?? null;
}

export async function clearSupportAuthCookies(): Promise<void> {
  try {
    const store = await cookies();
    store.delete(supportAuthConfig.cookieName);
    store.delete(supportAuthConfig.refreshCookieName);
  } catch {
    // Server Component — mutação indisponível.
  }
}

export async function hasSupportSessionCookie(): Promise<boolean> {
  return Boolean(await getSupportAccessToken());
}
