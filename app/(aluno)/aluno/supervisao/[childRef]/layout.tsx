import type { ReactNode } from "react";

import { GuardianGuard } from "@/features/auth";

export default function SupervisionLayout({ children }: { children: ReactNode }) {
  return <GuardianGuard>{children}</GuardianGuard>;
}
