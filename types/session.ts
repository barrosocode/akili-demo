import type { AccountOrigin } from "@/types/auth";
import type { ChildSummary } from "@/types/domain/child";
import type { PortalSubscription } from "@/types/domain/subscription";

export interface GuardianCapabilities {
  canAddChildren: boolean;
  canPurchase: boolean;
}

export interface SessionTerms {
  allAccepted: boolean;
  pendingCount: number;
  pendingKeys: string[];
}

export interface SessionUser {
  name: string;
  email: string;
  avatarUrl: string | null;
  roles: string[];
  permissions: string[];
  accountOrigin: AccountOrigin;
  capabilities: GuardianCapabilities;
  terms: SessionTerms;
  children: ChildSummary[];
  subscription: PortalSubscription | null;
  isDemo?: boolean;
  demoPersonaKey?: string;
}
