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
import type { SessionUser } from "@/types/session";
import { useSessionQuery } from "@/services/queries/auth.queries";

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

export function SessionProvider({
  children,
  initialUser = null,
}: {
  children: ReactNode;
  initialUser?: SessionUser | null;
}) {
  const { data, isLoading, refetch } = useSessionQuery(!initialUser);
  const user = data ?? initialUser ?? null;
  const [activeChildRef, setActiveChildRefState] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.sessionStorage.getItem(ACTIVE_CHILD_KEY);
    if (stored) setActiveChildRefState(stored);
  }, []);

  useEffect(() => {
    if (!user?.children.length) {
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
      isLoading: initialUser ? false : isLoading,
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
