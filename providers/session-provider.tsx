"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { SessionUser } from "@/types/session";
import { useSessionQuery } from "@/services/queries/auth.queries";

interface SessionContextValue {
  user: SessionUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refetch: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({
  children,
  initialUser = null,
}: {
  children: ReactNode;
  initialUser?: SessionUser | null;
}) {
  const { data, isLoading, refetch } = useSessionQuery(!initialUser);
  const user = data ?? initialUser ?? null;

  const value = useMemo(
    () => ({
      user,
      isLoading: initialUser ? false : isLoading,
      isAuthenticated: Boolean(user),
      refetch,
    }),
    [user, isLoading, initialUser, refetch]
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
