import { GuardianShell } from "@/components/layout/guardian-shell";
import { GuardianGuard } from "@/features/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GuardianGuard>
      <GuardianShell>{children}</GuardianShell>
    </GuardianGuard>
  );
}
