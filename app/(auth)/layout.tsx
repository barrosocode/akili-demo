import type { ReactNode } from "react";

import { MarketingShell } from "@/components/marketing/layout/MarketingShell";

import "@/styles/marketing.css";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <MarketingShell>{children}</MarketingShell>;
}
