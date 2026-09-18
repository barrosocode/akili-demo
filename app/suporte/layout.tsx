import type { ReactNode } from "react";

import { MarketingShell } from "@/components/marketing/layout/MarketingShell";

import "@/styles/marketing.css";

export default function SupportDeskLayout({ children }: { children: ReactNode }) {
  return <MarketingShell showLoginCta={false}>{children}</MarketingShell>;
}
