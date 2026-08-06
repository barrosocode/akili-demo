import { authConfig, GUARDIAN_PERMISSION } from "@/lib/auth/config";
import { can } from "@/lib/permissions/can";
import type { AuthUser } from "@/types/auth";

export type PortalKind = "guardian" | "student" | "admin";

export const STUDENT_DEFAULT_PATH = "/aluno";
export const GUARDIAN_DEFAULT_PATH = "/";

const INSTITUTIONAL_USER_TYPES = new Set<AuthUser["type"]>([
  "akili_admin",
  "school_admin",
  "teacher",
]);

const INSTITUTIONAL_ROLE_SLUGS = new Set([
  "master",
  "school_admin",
  "school_coordinator",
  "teacher",
]);

const ADMIN_DASHBOARD_PERMISSIONS = [
  "dashboards.school.view",
  "dashboards.teacher.view",
  "schools.read",
  "school.profile.read",
] as const;

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

  if (INSTITUTIONAL_USER_TYPES.has(user.type)) {
    return { portal: "admin", redirectTo: authConfig.adminAppUrl };
  }

  if (user.roles.some((role) => INSTITUTIONAL_ROLE_SLUGS.has(role))) {
    return { portal: "admin", redirectTo: authConfig.adminAppUrl };
  }

  const hasGuardianAccess = can(user.permissions, GUARDIAN_PERMISSION);
  const hasAdminDashboard = ADMIN_DASHBOARD_PERMISSIONS.some((permission) =>
    can(user.permissions, permission)
  );

  if (hasAdminDashboard && !hasGuardianAccess) {
    return { portal: "admin", redirectTo: authConfig.adminAppUrl };
  }

  if (user.type === "guardian" && hasGuardianAccess) {
    return { portal: "guardian", redirectTo: GUARDIAN_DEFAULT_PATH };
  }

  if (hasGuardianAccess) {
    return { portal: "guardian", redirectTo: GUARDIAN_DEFAULT_PATH };
  }

  return { portal: "admin", redirectTo: authConfig.adminAppUrl };
}

export function institutionalPortalMessage(): string {
  return "Este portal é exclusivo para responsáveis e alunos. Escolas e professores devem acessar o painel administrativo.";
}
