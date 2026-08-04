import type { AccountOrigin, AuthUser } from "@/types/auth";
import type { GuardianCapabilities, SessionUser } from "@/types/session";
import { GUARDIAN_PERMISSION } from "@/lib/auth/config";
import { can } from "@/lib/permissions/can";

export function resolveAccountOrigin(user: AuthUser): AccountOrigin {
  if (user.account_origin) return user.account_origin;
  if (can(user.permissions, "guardian.purchases.create")) return "b2c";
  return "school";
}

export function resolveGuardianCapabilities(user: AuthUser): GuardianCapabilities {
  const origin = resolveAccountOrigin(user);

  return {
    canAddChildren: origin === "b2c",
    canPurchase:
      origin === "b2c" && can(user.permissions, "guardian.purchases.create"),
  };
}

export function toSessionUser(user: AuthUser): SessionUser {
  const accountOrigin = resolveAccountOrigin(user);

  return {
    name: user.name,
    email: user.email,
    avatarUrl: user.profile_photo_url,
    roles: user.roles,
    permissions: user.permissions,
    accountOrigin,
    capabilities: resolveGuardianCapabilities(user),
  };
}

export function isGuardianUser(user: AuthUser): boolean {
  return can(user.permissions, GUARDIAN_PERMISSION);
}
