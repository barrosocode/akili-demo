"use client";

import type { ReactNode } from "react";

import { DemoTokenBootstrap } from "@/features/demo";
import { QueryProvider } from "@/providers/query-provider";
import { SessionProvider } from "@/providers/session-provider";
import type { SessionUser } from "@/types/session";

/**
 * Providers do site — sem Tooltip/Theme shadcn (PORTAL-014).
 */
export function AppProviders({
  children,
  initialUser = null,
}: {
  children: ReactNode;
  initialUser?: SessionUser | null;
}) {
  return (
    <QueryProvider>
      <SessionProvider initialUser={initialUser}>
        <DemoTokenBootstrap />
        {children}
      </SessionProvider>
    </QueryProvider>
  );
}
