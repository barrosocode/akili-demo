import type { AccountOrigin, AuthUser } from "@/types/auth";
import type { ClientPortalSession, PortalChild } from "@/types/portal-session";
import type { GuardianCapabilities, SessionUser } from "@/types/session";
import type { ChildSummary } from "@/types/domain/child";
import { GUARDIAN_PERMISSION } from "@/lib/auth/config";
import { can } from "@/lib/permissions/can";
import { toRef } from "@/lib/api/sanitize";

export function resolveAccountOrigin(
  permissions: string[],
  accountOrigin?: AccountOrigin
): AccountOrigin {
  if (accountOrigin) return accountOrigin;
  if (can(permissions, "guardian.purchases.create")) return "b2c";
  return "school";
}

export function resolveGuardianCapabilities(
  permissions: string[],
  accountOrigin: AccountOrigin
): GuardianCapabilities {
  return {
    canAddChildren: accountOrigin === "b2c",
    canPurchase:
      accountOrigin === "b2c" && can(permissions, "guardian.purchases.create"),
  };
}

export function mapPortalChild(child: PortalChild): ChildSummary {
  return {
    ref: toRef(child.uuid),
    name: child.name,
    avatarUrl: child.avatar ?? child.profile_photo_url ?? null,
    status: child.status,
    friendlyCode: null,
    gradeLabel: child.grade_label,
    classroomName: child.classroom_name,
    schoolName: child.school_name,
    canViewProgress: Boolean(child.can_view_progress),
    canPurchase: Boolean(child.can_purchase),
    accessible: Boolean(child.accessible),
  };
}

export function toSessionUserFromPortal(
  session: ClientPortalSession
): SessionUser {
  const accountOrigin = resolveAccountOrigin(
    session.permissions,
    session.account_origin
  );

  return {
    name: session.user.name,
    email: session.user.email,
    avatarUrl: session.user.profile_photo_url,
    roles: session.roles,
    permissions: session.permissions,
    accountOrigin,
    capabilities: resolveGuardianCapabilities(
      session.permissions,
      accountOrigin
    ),
    terms: {
      allAccepted: session.terms.all_accepted,
      pendingCount: session.terms.pending.length,
      pendingKeys: session.terms.pending.map((item) => item.key),
    },
    children: session.children.map(mapPortalChild),
  };
}

/** Login ainda devolve UserResource plano — mapear sem filhos/termos até o /me. */
export function toSessionUser(user: AuthUser): SessionUser {
  const accountOrigin = resolveAccountOrigin(
    user.permissions,
    user.account_origin
  );

  return {
    name: user.name,
    email: user.email,
    avatarUrl: user.profile_photo_url,
    roles: user.roles,
    permissions: user.permissions,
    accountOrigin,
    capabilities: resolveGuardianCapabilities(user.permissions, accountOrigin),
    terms: {
      allAccepted: true,
      pendingCount: 0,
      pendingKeys: [],
    },
    children: [],
  };
}

export function isGuardianUser(user: Pick<AuthUser, "permissions">): boolean {
  return can(user.permissions, GUARDIAN_PERMISSION);
}

export function isGuardianPortalSession(session: ClientPortalSession): boolean {
  return can(session.permissions, GUARDIAN_PERMISSION);
}
