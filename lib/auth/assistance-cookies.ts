import { cookies } from "next/headers";

import { authConfig } from "@/lib/auth/config";

export interface AssistanceCookiePayload {
  accessToken: string;
  expiresAt?: number;
}

export async function setAssistanceAuthCookie(
  payload: AssistanceCookiePayload
): Promise<void> {
  const store = await cookies();
  const maxAge = payload.expiresAt
    ? Math.max(0, Math.floor((payload.expiresAt - Date.now()) / 1000))
    : 60 * 30;

  store.set(authConfig.assistanceCookieName, payload.accessToken, {
    httpOnly: true,
    secure: authConfig.secure,
    sameSite: authConfig.sameSite,
    path: "/",
    maxAge,
  });
}

export async function getAssistanceAccessToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(authConfig.assistanceCookieName)?.value ?? null;
}

export async function hasAssistanceSessionCookie(): Promise<boolean> {
  return Boolean(await getAssistanceAccessToken());
}

/**
 * Apaga cookie de assistência. Só funciona em Route Handler / Server Action.
 */
export async function clearAssistanceAuthCookie(): Promise<void> {
  try {
    const store = await cookies();
    store.delete(authConfig.assistanceCookieName);
  } catch {
    // Next.js: cookies().delete() fora de Route Handler / Server Action.
  }
}
