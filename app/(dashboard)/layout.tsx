import type { ReactNode } from "react";

import { GuardianDashboardShell } from "@/components/portal/guardian/GuardianDashboardShell";
import { GuardianGuard } from "@/features/auth";

import "@/styles/marketing.css";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <GuardianGuard>
      <GuardianDashboardShell>{children}</GuardianDashboardShell>
    </GuardianGuard>
  );
}
