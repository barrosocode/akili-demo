import type { TawkIdentity } from "@/features/support/tawk/tawk.types";
import type { SessionUser } from "@/types/session";

export type TawkSessionDeps = {
  ensureLoaded: () => Promise<void>;
  /** Sempre buscar identidade pelo cookie/BFF — nunca receber user_id do client. */
  fetchIdentity: (sessionKey: string) => Promise<TawkIdentity>;
  login: (identity: TawkIdentity) => Promise<void>;
  logout: () => Promise<void>;
  maximize: () => void;
};

export type TawkSessionSyncResult =
  | "cleared"
  | "identified"
  | "unchanged"
  | "unavailable";

export type IdentifyOptions = {
  /** Revalida Identity API mesmo se já identificado (logout/expiração). */
  forceRefresh?: boolean;
};

/**
 * Chave de sessão Akili só para detectar troca de usuário.
 * Nunca é enviada ao Tawk como user_id — a Identity API é a única fonte.
 */
export function tawkSessionKeyFromUser(
  user: Pick<SessionUser, "email" | "isDemo" | "demoPersonaKey"> | null
): string | null {
  if (!user?.email) return null;
  const persona = user.demoPersonaKey?.trim() || (user.isDemo ? "demo" : "live");
  return `${user.email}::${persona}`;
}

/**
 * Orquestra identify/logout com fila serial (sem inits/logins concorrentes).
 */
export function createTawkSessionController(deps: TawkSessionDeps) {
  let boundSessionKey: string | null = null;
  let identifiedUserId: string | null = null;
  let queue: Promise<void> = Promise.resolve();

  function enqueue<T>(task: () => Promise<T>): Promise<T> {
    const run = queue.then(task, task);
    queue = run.then(
      () => undefined,
      () => undefined
    );
    return run;
  }

  async function clearIdentity(): Promise<void> {
    identifiedUserId = null;
    boundSessionKey = null;
    await deps.logout();
  }

  async function identifyForSession(
    sessionKey: string,
    options: IdentifyOptions = {}
  ): Promise<"identified" | "unchanged"> {
    if (
      !options.forceRefresh &&
      boundSessionKey === sessionKey &&
      identifiedUserId
    ) {
      return "unchanged";
    }

    if (boundSessionKey !== null && boundSessionKey !== sessionKey) {
      await clearIdentity();
    }

    await deps.ensureLoaded();

    // Identidade exclusivamente do Laravel (via BFF autenticado por cookie).
    const identity = await deps.fetchIdentity(sessionKey);

    if (
      !options.forceRefresh &&
      identifiedUserId === identity.user_id &&
      boundSessionKey === sessionKey
    ) {
      return "unchanged";
    }

    if (identifiedUserId && identifiedUserId !== identity.user_id) {
      await clearIdentity();
    }

    await deps.login(identity);
    identifiedUserId = identity.user_id;
    boundSessionKey = sessionKey;
    return "identified";
  }

  async function failClosed(): Promise<"unavailable"> {
    // Não deixar identidade anterior no widget após falha/expiração.
    await clearIdentity();
    return "unavailable";
  }

  return {
    getState() {
      return {
        boundSessionKey,
        identifiedUserId,
      };
    },

    /**
     * Sincroniza Tawk com a sessão Akili.
     * `sessionKey === null` → usuário não autenticado: logout, sem Identity API.
     */
    syncSession(sessionKey: string | null): Promise<TawkSessionSyncResult> {
      return enqueue(async () => {
        if (!sessionKey) {
          await clearIdentity();
          return "cleared" as const;
        }

        try {
          return await identifyForSession(sessionKey);
        } catch {
          return failClosed();
        }
      });
    },

    /**
     * Garante identify autenticado e abre o widget.
     * Sem sessão: não chama Identity API nem login.
     * Sempre revalida Identity API (detecta cookie/sessão expirados).
     */
    openChat(sessionKey: string | null): Promise<TawkSessionSyncResult> {
      return enqueue(async () => {
        if (!sessionKey) {
          return "cleared" as const;
        }

        try {
          const result = await identifyForSession(sessionKey, {
            forceRefresh: true,
          });
          deps.maximize();
          return result;
        } catch {
          return failClosed();
        }
      });
    },

    logout(): Promise<void> {
      return enqueue(async () => {
        await clearIdentity();
      });
    },
  };
}

export type TawkSessionController = ReturnType<typeof createTawkSessionController>;
