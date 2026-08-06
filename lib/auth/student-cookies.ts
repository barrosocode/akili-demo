import { cookies } from "next/headers";

import { studentAuthConfig } from "@/lib/auth/student-config";

export interface StudentAuthCookiePayload {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
}

export async function setStudentAuthCookies(
  payload: StudentAuthCookiePayload
): Promise<void> {
  const store = await cookies();
  const maxAge = payload.expiresAt
    ? Math.max(0, Math.floor((payload.expiresAt - Date.now()) / 1000))
    : 60 * 60 * 24 * 7;

  store.set(studentAuthConfig.cookieName, payload.accessToken, {
    httpOnly: true,
    secure: studentAuthConfig.secure,
    sameSite: studentAuthConfig.sameSite,
    path: "/",
    maxAge,
  });

  if (payload.refreshToken) {
    store.set(studentAuthConfig.refreshCookieName, payload.refreshToken, {
      httpOnly: true,
      secure: studentAuthConfig.secure,
      sameSite: studentAuthConfig.sameSite,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }
}

export async function getStudentAccessToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(studentAuthConfig.cookieName)?.value ?? null;
}

export async function getStudentRefreshToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(studentAuthConfig.refreshCookieName)?.value ?? null;
}

export async function clearStudentAuthCookies(): Promise<void> {
  try {
    const store = await cookies();
    store.delete(studentAuthConfig.cookieName);
    store.delete(studentAuthConfig.refreshCookieName);
  } catch {
    // Server Component — mutação indisponível.
  }
}

export async function hasStudentSessionCookie(): Promise<boolean> {
  return Boolean(await getStudentAccessToken());
}
