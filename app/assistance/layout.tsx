import type { ReactNode } from "react";

import { MarketingShell } from "@/components/marketing/layout/MarketingShell";

import "@/styles/marketing.css";

/**
 * Bridge de atendimento (adopt / entrar) — mesmo chrome do portal marketing/auth.
 */
export default function AssistanceLayout({ children }: { children: ReactNode }) {
  return <MarketingShell showLoginCta={false}>{children}</MarketingShell>;
}
