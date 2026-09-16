import { cookies } from "next/headers";

import { authConfig } from "@/lib/auth/config";
import { assistanceCookieOptions } from "@/lib/auth/assistance-cookie-options";

export { assistanceCookieOptions } from "@/lib/auth/assistance-cookie-options";

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

  store.set(
    authConfig.assistanceCookieName,
    payload.accessToken,
    assistanceCookieOptions(maxAge)
  );
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
    store.set(authConfig.assistanceCookieName, "", {
      ...assistanceCookieOptions(0),
    });
  } catch {
    // Next.js: cookies().set() fora de Route Handler / Server Action.
  }
}
