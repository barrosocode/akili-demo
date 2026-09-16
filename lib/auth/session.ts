import { laravelRequest } from "@/lib/api/laravel-client";
import { getAccessToken } from "@/lib/auth/cookies";
import { institutionalPortalMessage } from "@/lib/auth/portal-destination";
import {
  isGuardianPortalSession,
  toSessionUserFromPortal,
} from "@/lib/permissions/guardian-capabilities";
import type { ClientPortalSession } from "@/types/portal-session";
import type { SessionUser } from "@/types/session";
import { ApiError } from "@/types/api";

export type FetchPortalSessionResult =
  | { ok: true; session: SessionUser }
  | { ok: false; error: ApiError };

export type FetchPortalSessionOptions = {
  /**
   * When set, calls /client/auth/me with this Bearer and skipAuth —
   * used right after adopt so we don't rely on cookie round-trip
   * or fall back to the support-desk PAT via getAccessToken().
   */
  accessToken?: string;
};

/**
 * Lê a sessão agregada do portal (`GET /client/auth/me`).
 * Propaga 401/403 — não engole erros de negócio.
 */
export async function fetchPortalSession(
  options?: FetchPortalSessionOptions
): Promise<FetchPortalSessionResult> {
  const explicitToken = options?.accessToken?.trim();
  const token = explicitToken || (await getAccessToken());
  if (!token) {
    return {
      ok: false,
      error: new ApiError({
        title: "Não autenticado",
        status: 401,
        detail: "Sessão ausente.",
      }),
    };
  }

  try {
    const portal = await laravelRequest<ClientPortalSession>("/client/auth/me", {
      skipUnauthorizedRetry: true,
      ...(explicitToken
        ? {
            skipAuth: true,
            headers: { Authorization: `Bearer ${explicitToken}` },
          }
        : {}),
    });

    if (!isGuardianPortalSession(portal)) {
      return {
        ok: false,
        error: new ApiError({
          title: "Acesso negado",
          status: 403,
          detail: institutionalPortalMessage(),
        }),
      };
    }

    return { ok: true, session: toSessionUserFromPortal(portal) };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, error };
    }
    return {
      ok: false,
      error: new ApiError({
        title: "Erro na requisição",
        status: 500,
        detail: error instanceof Error ? error.message : "Erro desconhecido",
      }),
    };
  }
}

/**
 * Sessão para Server Components.
 * Em 401 retorna null. Em 403 consent-required ainda devolve null aqui —
 * o Route Handler `/api/auth/me` propaga o status para o client.
 */
export async function getServerSession(): Promise<SessionUser | null> {
  const result = await fetchPortalSession();
  if (!result.ok) return null;
  return result.session;
}

export async function requireAuth(): Promise<SessionUser> {
  const result = await fetchPortalSession();
  if (!result.ok) {
    throw result.error;
  }
  return result.session;
}
