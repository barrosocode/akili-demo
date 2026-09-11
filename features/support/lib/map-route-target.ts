import {
  GUARDIAN_HOME_PATH,
  STUDENT_HOME_PATH,
  STUDENT_LOGIN_PATH,
} from "@/lib/auth/portal-paths";
import type {
  SupportFaqAction,
  SupportFaqRouteTarget,
} from "@/types/domain/support-faq";

const ROUTE_TARGET_HREF: Partial<Record<SupportFaqRouteTarget, string>> = {
  guardian_children: GUARDIAN_HOME_PATH,
  guardian_signin: "/signin",
  guardian_profile: "/profile",
  guardian_reports: "/relatorios",
  student_login: STUDENT_LOGIN_PATH,
  student_materials: STUDENT_HOME_PATH,
};

export type ResolvedSupportAction =
  | { kind: "internal"; href: string; label: string }
  | { kind: "external"; href: string; label: string };

function isSafeExternalUrl(target: string): boolean {
  try {
    const url = new URL(target);
    return url.protocol === "https:" || url.protocol === "mailto:";
  } catch {
    return false;
  }
}

/**
 * Maps FAQ actions to navigable links for the guardian portal.
 * Admin / teacher / school route targets are omitted.
 */
export function resolveSupportActions(
  actions: SupportFaqAction[]
): ResolvedSupportAction[] {
  const resolved: ResolvedSupportAction[] = [];

  for (const action of actions) {
    const label = action.label.trim();
    if (!label) continue;

    if (action.type === "external_url") {
      const href = action.target.trim();
      if (!isSafeExternalUrl(href)) continue;
      resolved.push({ kind: "external", href, label });
      continue;
    }

    if (action.type === "route") {
      const href = ROUTE_TARGET_HREF[action.target as SupportFaqRouteTarget];
      if (!href) continue;
      resolved.push({ kind: "internal", href, label });
    }
  }

  return resolved;
}
