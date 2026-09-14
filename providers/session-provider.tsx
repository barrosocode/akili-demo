"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { endAuthenticatedTawkSession } from "@/features/support/tawk/tawk-lifecycle";
import { BffClientError } from "@/services/bff/client";
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
  const user = unauthorized ? null : (data ?? null);
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
