import { laravelRequest } from "@/lib/api/laravel-client";
import { studentLaravelRequest } from "@/lib/api/student-laravel-client";
import { clearAssistanceAuthCookie } from "@/lib/auth/assistance-cookies";
import { clearAuthCookies, setAuthCookies } from "@/lib/auth/cookies";
import {
  clearStudentAuthCookies,
  setStudentAuthCookies,
} from "@/lib/auth/student-cookies";
import {
  clearSupportAuthCookies,
  setSupportAuthCookies,
} from "@/lib/auth/support-cookies";
import { fetchPortalSession } from "@/lib/auth/session";
import { toSessionUser } from "@/lib/permissions/guardian-capabilities";
import type { AuthUser, LoginResponse } from "@/types/auth";
import type { SessionUser } from "@/types/session";

function tokenExpiry(expiresIn?: number): number | undefined {
  return expiresIn ? Date.now() + expiresIn * 1000 : undefined;
}

export async function establishGuardianSession(
  response: LoginResponse
): Promise<SessionUser> {
  await clearStudentAuthCookies();
  await clearSupportAuthCookies();
  await clearAssistanceAuthCookie();
  await setAuthCookies({
    accessToken: response.token,
    refreshToken: response.refresh_token,
    expiresAt: tokenExpiry(response.expires_in),
  });

  const portal = await fetchPortalSession();
  if (!portal.ok) {
    throw portal.error;
  }

  return portal.session;
}

export async function establishStudentSession(
  response: LoginResponse
): Promise<Record<string, unknown>> {
  await clearAuthCookies();
  await clearSupportAuthCookies();
  await clearAssistanceAuthCookie();
  await setStudentAuthCookies({
    accessToken: response.token,
    refreshToken: response.refresh_token,
    expiresAt: tokenExpiry(response.expires_in),
  });

  try {
    return await studentLaravelRequest<Record<string, unknown>>(
      "/mobile/auth/session",
      { skipUnauthorizedRetry: true }
    );
  } catch {
    return {
      user: response.user,
      bootstrap: true,
    };
  }
}

export async function establishSupportSession(
  response: LoginResponse
): Promise<AuthUser> {
  await clearAuthCookies();
  await clearStudentAuthCookies();
  await clearAssistanceAuthCookie();
  await setSupportAuthCookies({
    accessToken: response.token,
    refreshToken: response.refresh_token,
    expiresAt: tokenExpiry(response.expires_in),
  });

  return response.user;
}

export async function authenticateWithLaravel(
  email: string,
  password: string,
  deviceName: string
): Promise<LoginResponse> {
  return laravelRequest<LoginResponse>("/client/auth/login", {
    method: "POST",
    data: { email, password, device_name: deviceName },
    skipAuth: true,
    skipUnauthorizedRetry: true,
  });
}

/** Canal mobile — o portal do aluno só aceita PAT de `/mobile/auth/*`. */
export async function authenticateStudentWithLaravel(
  email: string,
  password: string
): Promise<LoginResponse> {
  return studentLaravelRequest<LoginResponse>("/mobile/auth/login", {
    method: "POST",
    data: { email, password, device_name: "student-web" },
    skipAuth: true,
    skipUnauthorizedRetry: true,
  });
}

export async function authenticateSupportWithLaravel(
  email: string,
  password: string
): Promise<LoginResponse> {
  return laravelRequest<LoginResponse>("/support/auth/login", {
    method: "POST",
    data: { email, password },
    skipAuth: true,
    skipUnauthorizedRetry: true,
  });
}

export function loginFallbackSession(response: LoginResponse): SessionUser {
  return toSessionUser(response.user);
}
