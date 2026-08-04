"use client";

import type { ReactNode } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { AppShell } from "@/components/layout/app-shell";
import { GuardianSidebar } from "@/components/layout/guardian-sidebar";

export function GuardianShell({ children }: { children: ReactNode }) {
  return (
    <AppShell sidebar={<GuardianSidebar />} header={<AppHeader />}>
      {children}
    </AppShell>
  );
}
