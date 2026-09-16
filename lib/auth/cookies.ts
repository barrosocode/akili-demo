import { cookies } from "next/headers";
import { authConfig } from "@/lib/auth/config";
import {
  clearAssistanceAuthCookie,
  getAssistanceAccessToken,
} from "@/lib/auth/assistance-cookies";
import {
  clearSupportAuthCookies,
  getSupportAccessToken,
  getSupportRefreshToken,
} from "@/lib/auth/support-cookies";

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

/**
 * Prioridade: assistência → mesa suporte → responsável.
 */
export async function getAccessToken(): Promise<string | null> {
  const assistance = await getAssistanceAccessToken();
  if (assistance) return assistance;

  const support = await getSupportAccessToken();
  if (support) return support;

  const store = await cookies();
  return store.get(authConfig.cookieName)?.value ?? null;
}

export async function getGuardianAccessToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(authConfig.cookieName)?.value ?? null;
}

export async function getRefreshToken(): Promise<string | null> {
  const assistance = await getAssistanceAccessToken();
  if (assistance) {
    // Assistência não usa refresh cookie — evita misturar com sessão normal.
    return null;
  }

  const supportRefresh = await getSupportRefreshToken();
  if (supportRefresh) return supportRefresh;

  const supportAccess = await getSupportAccessToken();
  if (supportAccess) return supportAccess;

  const store = await cookies();
  return store.get(authConfig.refreshCookieName)?.value ?? null;
}

export async function isSupportDeskTokenActive(): Promise<boolean> {
  if (await getAssistanceAccessToken()) return false;
  return Boolean(await getSupportAccessToken());
}

/**
 * Apaga cookies de sessão do responsável. Não remove assistência nem mesa.
 * Só funciona em Route Handler / Server Action.
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

/** Limpa sessão normal + assistência + mesa (logout / expiração). */
export async function clearAllPortalAuthCookies(): Promise<void> {
  await clearAuthCookies();
  await clearAssistanceAuthCookie();
  await clearSupportAuthCookies();
}

export async function hasSessionCookie(): Promise<boolean> {
  return Boolean(await getAccessToken());
}
