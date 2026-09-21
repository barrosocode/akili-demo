import type {
  SupportFaqAction,
  SupportFaqRouteTarget,
} from "@/types/domain/support-faq";

/** Paths aligned with `lib/auth/portal-paths`. */
const ROUTE_TARGET_HREF: Partial<Record<SupportFaqRouteTarget, string>> = {
  guardian_children: "/children",
  guardian_signin: "/signin",
  guardian_first_access: "/first-access",
  guardian_forgot_password: "/forgot-password",
  guardian_profile: "/profile",
  guardian_reports: "/relatorios",
  student_login: "/aluno/entrar",
  student_materials: "/aluno/materiais",
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
  actions: SupportFaqAction[] | null | undefined
): ResolvedSupportAction[] {
  if (!Array.isArray(actions)) {
    return [];
  }

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
