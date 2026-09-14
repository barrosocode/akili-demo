"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { TawkWidget } from "@/features/support/tawk/TawkWidget";
import { bindTawkSessionReset } from "@/features/support/tawk/tawk-lifecycle";
import {
  createTawkSessionController,
  tawkSessionKeyFromUser,
  type TawkSessionController,
} from "@/features/support/tawk/tawk-session";
import {
  ensureTawkLoaded,
  setTawkPublicConfig,
  loginTawk,
  logoutTawk,
  maximizeTawk,
} from "@/features/support/tawk/tawk.service";
import type {
  TawkContextValue,
  TawkPublicConfig,
  TawkStatus,
} from "@/features/support/tawk/tawk.types";
import { useSession } from "@/providers/session-provider";
import { supportBff } from "@/services/bff/support.bff";
import { queryKeys } from "@/services/queries/query-keys";

export const TawkContext = createContext<TawkContextValue | null>(null);

type TawkProviderProps = {
  children: ReactNode;
  /** Lido no server (`TAWK_*`) e injetado — não usar NEXT_PUBLIC_ no client. */
  config: TawkPublicConfig | null;
};

function applySyncResult(
  result: Awaited<ReturnType<TawkSessionController["syncSession"]>>,
  setStatus: (value: TawkStatus | ((current: TawkStatus) => TawkStatus)) => void
) {
  if (result === "unavailable") {
    setStatus("unavailable");
    return;
  }
  if (result === "cleared") {
    setStatus((current) => (current === "unavailable" ? current : "idle"));
    return;
  }
  setStatus("ready");
}

export function TawkProvider({ children, config }: TawkProviderProps) {
  // Sincrono no render: ensureTawkLoaded/getTawkPublicConfig precisam da config
  // antes dos effects (process.env.TAWK_* não existe no bundle client).
  setTawkPublicConfig(config);

  const queryClient = useQueryClient();
  const { user, isAuthenticated, isLoading: sessionLoading } = useSession();
  const configured = Boolean(config);
  const sessionKey = useMemo(
    () => (isAuthenticated ? tawkSessionKeyFromUser(user) : null),
    [isAuthenticated, user]
  );

  const loadRequested = Boolean(configured && sessionKey);
  const [status, setStatus] = useState<TawkStatus>(
    configured ? "idle" : "unavailable"
  );

  const previousSessionKeyRef = useRef<string | null | undefined>(undefined);

  const controller = useMemo(
    () =>
      createTawkSessionController({
        ensureLoaded: ensureTawkLoaded,
        fetchIdentity: (key) =>
          queryClient.fetchQuery({
            queryKey: queryKeys.support.tawkIdentity(key),
            queryFn: () => supportBff.tawkIdentity(),
            // Identity nunca fica “quente” por muito tempo: logout/expiração
            // devem forçar novo round-trip ao Laravel.
            staleTime: 0,
          }),
        login: loginTawk,
        logout: logoutTawk,
        maximize: maximizeTawk,
      }),
    [queryClient]
  );

  useEffect(() => {
    bindTawkSessionReset(() => {
      queryClient.removeQueries({ queryKey: queryKeys.support.tawkIdentityRoot });
      return controller.logout();
    });
    return () => {
      bindTawkSessionReset(null);
    };
  }, [controller, queryClient]);

  useEffect(() => {
    if (!configured || sessionLoading) return;

    const previous = previousSessionKeyRef.current;
    previousSessionKeyRef.current = sessionKey;

    if (previous !== undefined && previous !== sessionKey) {
      queryClient.removeQueries({ queryKey: queryKeys.support.tawkIdentityRoot });
    }

    let cancelled = false;

    void controller.syncSession(sessionKey).then((result) => {
      if (cancelled) return;
      applySyncResult(result, setStatus);
    });

    return () => {
      cancelled = true;
    };
  }, [configured, controller, queryClient, sessionKey, sessionLoading]);

  const openChat = useCallback(async () => {
    if (!configured) return false;

    if (!sessionKey) {
      // Usuário não autenticado: não executa login autenticado / Identity API.
      return false;
    }

    const result = await controller.openChat(sessionKey);
    applySyncResult(result, setStatus);
    return result === "identified" || result === "unchanged";
  }, [configured, controller, sessionKey]);

  const maximize = useCallback(() => {
    maximizeTawk();
  }, []);

  const logout = useCallback(() => {
    queryClient.removeQueries({ queryKey: queryKeys.support.tawkIdentityRoot });
    void controller.logout().then(() => {
      setStatus((current) => (current === "unavailable" ? current : "idle"));
    });
  }, [controller, queryClient]);

  const onWidgetReady = useCallback(() => {
    setStatus((current) => (current === "unavailable" ? current : "ready"));
  }, []);

  const onWidgetError = useCallback(() => {
    setStatus("unavailable");
  }, []);

  const value = useMemo<TawkContextValue>(
    () => ({
      status,
      isReady: status === "ready",
      isAvailable: configured && status !== "unavailable",
      openChat,
      maximize,
      logout,
    }),
    [configured, logout, maximize, openChat, status]
  );

  return (
    <TawkContext.Provider value={value}>
      {children}
      {configured ? (
        <TawkWidget
          load={loadRequested}
          onReady={onWidgetReady}
          onError={onWidgetError}
        />
      ) : null}
    </TawkContext.Provider>
  );
}
