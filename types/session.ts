import type { AccountOrigin } from "@/types/auth";

export interface GuardianCapabilities {
  canAddChildren: boolean;
  canPurchase: boolean;
}

export interface SessionUser {
  name: string;
  email: string;
  avatarUrl: string | null;
  roles: string[];
  permissions: string[];
  accountOrigin: AccountOrigin;
  capabilities: GuardianCapabilities;
}
