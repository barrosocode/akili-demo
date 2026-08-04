import { laravelRequest } from "@/lib/api/laravel-client";
import { clearAuthCookies, getAccessToken } from "@/lib/auth/cookies";
import {
  isGuardianUser,
  toSessionUser,
} from "@/lib/permissions/guardian-capabilities";
import type { AuthUser } from "@/types/auth";
import type { SessionUser } from "@/types/session";

export async function fetchAuthUser(): Promise<AuthUser | null> {
  const token = await getAccessToken();
  if (!token) return null;

  try {
    return await laravelRequest<AuthUser>("/client/auth/me");
  } catch {
    await clearAuthCookies();
    return null;
  }
}

export async function getServerSession(): Promise<SessionUser | null> {
  const user = await fetchAuthUser();
  if (!user || !isGuardianUser(user)) return null;
  return toSessionUser(user);
}

export async function requireAuth(): Promise<SessionUser> {
  const session = await getServerSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}
