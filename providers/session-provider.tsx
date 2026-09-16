"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { endAuthenticatedTawkSession } from "@/features/support/tawk/tawk-lifecycle";
import { BffClientError } from "@/services/bff/client";
import { assistanceBff } from "@/services/bff/assistance.bff";
import { useSessionQuery } from "@/services/queries/auth.queries";
import { queryKeys } from "@/services/queries/query-keys";
import type { SessionUser } from "@/types/session";

interface SessionContextValue {
  user: SessionUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  activeChildRef: string | null;
  setActiveChildRef: (ref: string | null) => void;
  refetch: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

const ACTIVE_CHILD_KEY = "akili_active_child_ref";

function isUnauthorizedSessionError(error: unknown): boolean {
  return error instanceof BffClientError && error.status === 401;
}

function isAssistanceExpiredSessionError(error: unknown): boolean {
  if (!(error instanceof BffClientError)) return false;
  if (error.errorCode === "support_assistance_expired") return true;
  return (error.type ?? "").includes("support-assistance-expired");
}

export function SessionProvider({
  children,
  initialUser = null,
}: {
  children: ReactNode;
  initialUser?: SessionUser | null;
}) {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error, refetch } =
    useSessionQuery(initialUser);
  const unauthorized = isError && isUnauthorizedSessionError(error);
  const assistanceExpired = isError && isAssistanceExpiredSessionError(error);
  const user = unauthorized || assistanceExpired ? null : (data ?? null);
  const expiryHandledRef = useRef(false);
  const [activeChildRef, setActiveChildRefState] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return window.sessionStorage.getItem(ACTIVE_CHILD_KEY);
  });

  useEffect(() => {
    if (!unauthorized) return;

    queryClient.setQueryData(queryKeys.auth.me, null);
    queryClient.removeQueries({ queryKey: queryKeys.support.tawkIdentityRoot });
    void endAuthenticatedTawkSession();
  }, [unauthorized, queryClient]);

  useEffect(() => {
    if (!assistanceExpired || expiryHandledRef.current) return;
    expiryHandledRef.current = true;

    void (async () => {
      let redirectTo: string | null = null;
      try {
        const result = await assistanceBff.end();
        redirectTo = result.redirectTo;
      } catch {
        // cookies já podem ter sido limpos no /me
      } finally {
        queryClient.clear();
        await endAuthenticatedTawkSession();
        window.location.assign(redirectTo ?? "/signin");
      }
    })();
  }, [assistanceExpired, queryClient]);

  useEffect(() => {
    if (!user?.children.length) {
      // Sync active child when the guardian session has no children.
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sessionStorage/child list bridge
      setActiveChildRefState(null);
      return;
    }

    setActiveChildRefState((current) => {
      if (current && user.children.some((child) => child.ref === current)) {
        return current;
      }
      const next = user.children[0]?.ref ?? null;
      if (typeof window !== "undefined") {
        if (next) window.sessionStorage.setItem(ACTIVE_CHILD_KEY, next);
        else window.sessionStorage.removeItem(ACTIVE_CHILD_KEY);
      }
      return next;
    });
  }, [user]);

  const setActiveChildRef = useCallback((ref: string | null) => {
    setActiveChildRefState(ref);
    if (typeof window === "undefined") return;
    if (ref) window.sessionStorage.setItem(ACTIVE_CHILD_KEY, ref);
    else window.sessionStorage.removeItem(ACTIVE_CHILD_KEY);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading: Boolean(initialUser) ? false : isLoading,
      isAuthenticated: Boolean(user),
      activeChildRef,
      setActiveChildRef,
      refetch,
    }),
    [user, isLoading, initialUser, activeChildRef, setActiveChildRef, refetch]
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return context;
}
