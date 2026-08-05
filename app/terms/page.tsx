import type { Metadata } from "next";

import { GuardianGuard } from "@/features/auth";
import { TermsAcceptForm } from "@/features/auth/components/terms-accept-form";
import { MarketingShell } from "@/components/marketing/layout/MarketingShell";

import "@/styles/marketing.css";

export const metadata: Metadata = {
  title: "Aceite dos termos",
  robots: { index: false, follow: false },
};

export default function TermsPage() {
  return (
    <MarketingShell>
      <GuardianGuard>
        <TermsAcceptForm />
      </GuardianGuard>
    </MarketingShell>
  );
}
