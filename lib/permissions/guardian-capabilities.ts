import type { AccountOrigin, AuthUser } from "@/types/auth";
import type {
  ClientPortalSession,
  PortalChild,
  PortalSubscriptionRaw,
} from "@/types/portal-session";
import type { GuardianCapabilities, SessionUser } from "@/types/session";
import type { ChildSummary } from "@/types/domain/child";
import type { PortalSubscription } from "@/types/domain/subscription";
import { GUARDIAN_PERMISSION } from "@/lib/auth/config";
import { can } from "@/lib/permissions/can";
import { toRef } from "@/lib/api/sanitize";
import {
  applyAssistanceCapabilities,
  isAssistanceReadOnly,
  mapPortalAssistance,
} from "@/features/assistance/assistance-session";

export { isAssistanceReadOnly, mapPortalAssistance };

export function resolveAccountOrigin(
  permissions: string[],
  accountOrigin?: AccountOrigin
): AccountOrigin {
  if (accountOrigin) return accountOrigin;
  if (can(permissions, "guardian.purchases.create")) return "b2c";
  return "school";
}

export function mapPortalSubscription(
  subscription: PortalSubscriptionRaw | null | undefined
): PortalSubscription | null {
  if (!subscription) return null;

  return {
    planKey: subscription.plan_key,
    planName: subscription.plan_name,
    status: subscription.status,
    audience: subscription.audience,
    startsAt: subscription.starts_at,
    endsAt: subscription.ends_at,
    description: subscription.description,
    limits: {
      maxStudents: subscription.limits.max_students,
      studentsUsed: subscription.limits.students_used,
      maxPackages: subscription.limits.max_packages,
    },
    features: subscription.features ?? {},
    upgradeTargets: subscription.upgrade_targets ?? [],
    downgradeTargets: subscription.downgrade_targets ?? [],
  };
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
  const assistance = mapPortalAssistance(session.assistance ?? null);
  const capabilities = applyAssistanceCapabilities(
    resolveGuardianCapabilities(session.permissions, accountOrigin),
    assistance
  );

  return {
    name: session.user.name,
    email: session.user.email,
    avatarUrl: session.user.profile_photo_url,
    roles: session.roles,
    permissions: session.permissions,
    accountOrigin,
    capabilities,
    terms: {
      allAccepted: session.terms.all_accepted,
      pendingCount: session.terms.pending.length,
      pendingKeys: session.terms.pending.map((item) => item.key),
    },
    children: session.children.map(mapPortalChild),
    subscription: mapPortalSubscription(session.subscription),
    isDemo:
      typeof session.user.is_demo === "boolean" ? session.user.is_demo : undefined,
    demoPersonaKey: session.user.demo_persona_key,
    assistance,
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
    subscription: null,
    isDemo: typeof user.is_demo === "boolean" ? user.is_demo : undefined,
    demoPersonaKey: user.demo_persona_key,
  };
}

export function isGuardianUser(user: Pick<AuthUser, "permissions">): boolean {
  return can(user.permissions, GUARDIAN_PERMISSION);
}

export function isGuardianPortalSession(session: ClientPortalSession): boolean {
  return can(session.permissions, GUARDIAN_PERMISSION);
}
