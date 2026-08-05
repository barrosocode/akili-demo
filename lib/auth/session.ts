import { laravelRequest } from "@/lib/api/laravel-client";
import { getAccessToken } from "@/lib/auth/cookies";
import {
  isGuardianUser,
  toSessionUser,
} from "@/lib/permissions/guardian-capabilities";
import type { AuthUser } from "@/types/auth";
import type { SessionUser } from "@/types/session";

/**
 * Lê o usuário autenticado.
 * Não apaga cookies aqui: Server Components não podem mutar cookies
 * (só Route Handlers / Server Actions). Limpeza fica em logout/refresh.
 */
export async function fetchAuthUser(): Promise<AuthUser | null> {
  const token = await getAccessToken();
  if (!token) return null;

  try {
    return await laravelRequest<AuthUser>("/client/auth/me", {
      skipUnauthorizedRetry: true,
    });
  } catch {
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
