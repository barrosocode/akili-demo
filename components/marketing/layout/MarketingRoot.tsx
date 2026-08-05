import type { ReactNode } from "react";

import { KiddinoRoot } from "@/components/theme/KiddinoRoot";

type MarketingRootProps = {
  children: ReactNode;
};

/**
 * Root marketing — delega ao KiddinoRoot compartilhado (SPEC-014).
 */
export function MarketingRoot({ children }: MarketingRootProps) {
  return <KiddinoRoot>{children}</KiddinoRoot>;
}
