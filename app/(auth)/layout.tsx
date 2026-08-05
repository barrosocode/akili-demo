import type { ReactNode } from "react";

import { AuthShell } from "@/components/portal/auth/AuthShell";

import "@/styles/marketing.css";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <AuthShell>{children}</AuthShell>;
}
