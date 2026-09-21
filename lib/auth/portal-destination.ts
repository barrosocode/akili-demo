import { authConfig, GUARDIAN_PERMISSION } from "@/lib/auth/config";
import {
  GUARDIAN_HOME_PATH,
  STUDENT_HOME_PATH,
} from "@/lib/auth/portal-paths";
import {
  SUPPORT_ASSISTANCE_START_PERMISSION,
  SUPPORT_HOME_PATH,
} from "@/lib/auth/support-config";
import { can } from "@/lib/permissions/can";
import type { AuthUser } from "@/types/auth";

export type PortalKind = "guardian" | "student" | "admin" | "support";

export const STUDENT_DEFAULT_PATH = STUDENT_HOME_PATH;
export const GUARDIAN_DEFAULT_PATH = GUARDIAN_HOME_PATH;
export const SUPPORT_DEFAULT_PATH = SUPPORT_HOME_PATH;

const INSTITUTIONAL_USER_TYPES = new Set<AuthUser["type"]>([
  "akili_admin",
  "school_admin",
  "teacher",
  "coordinator",
]);

const INSTITUTIONAL_ROLE_SLUGS = new Set([
  "master",
  "school_admin",
  "school_coordinator",
  "teacher",
]);

export function hasSupportAssistanceStartPermission(
  user: Pick<AuthUser, "permissions">
): boolean {
  return can(user.permissions, SUPPORT_ASSISTANCE_START_PERMISSION);
}

/**
 * Define o portal de destino com base em `user.type`, roles e permissions da API.
 */
export function resolvePortalDestination(user: AuthUser): {
  portal: PortalKind;
  redirectTo: string;
} {
  if (user.type === "student") {
    return { portal: "student", redirectTo: STUDENT_DEFAULT_PATH };
  }

  // Permission-based support desk (before institutional → admin bounce).
  if (hasSupportAssistanceStartPermission(user)) {
    return { portal: "support", redirectTo: SUPPORT_DEFAULT_PATH };
  }

  const hasGuardianAccess = can(user.permissions, GUARDIAN_PERMISSION);
  // Site is the guardian/student portal: prefer the family home even if the
  // seed also carries a leftover school/teacher role.
  if (
    user.type === "guardian" ||
    hasGuardianAccess ||
    user.roles.includes("guardian")
  ) {
    return { portal: "guardian", redirectTo: GUARDIAN_DEFAULT_PATH };
  }

  if (INSTITUTIONAL_USER_TYPES.has(user.type)) {
    return { portal: "admin", redirectTo: authConfig.adminAppUrl };
  }

  if (user.roles.some((role) => INSTITUTIONAL_ROLE_SLUGS.has(role))) {
    return { portal: "admin", redirectTo: authConfig.adminAppUrl };
  }

  return { portal: "admin", redirectTo: authConfig.adminAppUrl };
}

export function institutionalPortalMessage(): string {
  return "Este portal é exclusivo para responsáveis e alunos. Escolas e professores devem acessar o painel administrativo.";
}

export function supportPortalDeniedMessage(): string {
  return "Este acesso é exclusivo para operadores de atendimento.";
}
