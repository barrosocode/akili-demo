import { cookies } from "next/headers";
import { authConfig } from "@/lib/auth/config";

export interface AuthCookiePayload {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
}

export async function setAuthCookies(payload: AuthCookiePayload): Promise<void> {
  const store = await cookies();
  const maxAge = payload.expiresAt
    ? Math.max(0, Math.floor((payload.expiresAt - Date.now()) / 1000))
    : 60 * 60 * 24 * 7;

  store.set(authConfig.cookieName, payload.accessToken, {
    httpOnly: true,
    secure: authConfig.secure,
    sameSite: authConfig.sameSite,
    path: "/",
    maxAge,
  });

  if (payload.refreshToken) {
    store.set(authConfig.refreshCookieName, payload.refreshToken, {
      httpOnly: true,
      secure: authConfig.secure,
      sameSite: authConfig.sameSite,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }
}

export async function getAccessToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(authConfig.cookieName)?.value ?? null;
}

export async function getRefreshToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(authConfig.refreshCookieName)?.value ?? null;
}

/**
 * Apaga cookies de sessão. Só funciona em Route Handler / Server Action.
 * Em Server Component a mutação falha — engolimos o erro para não quebrar RSC.
 */
export async function clearAuthCookies(): Promise<void> {
  try {
    const store = await cookies();
    store.delete(authConfig.cookieName);
    store.delete(authConfig.refreshCookieName);
  } catch {
    // Next.js: cookies().delete() fora de Route Handler / Server Action.
  }
}

export async function hasSessionCookie(): Promise<boolean> {
  return Boolean(await getAccessToken());
}
