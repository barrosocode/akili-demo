import type { LoginSuccessPayload } from "@/types/auth-login";
import {
  GUARDIAN_HOME_PATH,
  resolveGuardianPostLoginPath,
  STUDENT_HOME_PATH,
  STUDENT_LEGACY_DASHBOARD_PATH,
} from "@/lib/auth/portal-paths";
import { SUPPORT_HOME_PATH } from "@/lib/auth/support-config";

/**
 * Destino pós-login do responsável (paths relativos internos seguros).
 * Bloqueia `/aluno` fora de supervisão.
 */
export function resolvePostLoginPath(next: string | null | undefined): string {
  return resolveGuardianPostLoginPath(next);
}

function resolveStudentPostLoginPath(next: string | null | undefined): string {
  if (!next || typeof next !== "string") return STUDENT_HOME_PATH;

  const trimmed = next.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.includes("://")) {
    return STUDENT_HOME_PATH;
  }

  if (trimmed.startsWith("/aluno") || trimmed.startsWith("/student")) {
    if (
      trimmed === STUDENT_LEGACY_DASHBOARD_PATH ||
      trimmed.startsWith(`${STUDENT_LEGACY_DASHBOARD_PATH}/`)
    ) {
      return STUDENT_HOME_PATH;
    }
    if (trimmed.startsWith("/aluno/supervisao")) {
      return STUDENT_HOME_PATH;
    }
    return trimmed;
  }

  return STUDENT_HOME_PATH;
}

function resolveSupportPostLoginPath(next: string | null | undefined): string {
  if (!next || typeof next !== "string") return SUPPORT_HOME_PATH;

  const trimmed = next.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.includes("://")) {
    return SUPPORT_HOME_PATH;
  }

  if (trimmed === SUPPORT_HOME_PATH || trimmed.startsWith(`${SUPPORT_HOME_PATH}/`)) {
    return trimmed;
  }

  return SUPPORT_HOME_PATH;
}

/**
 * Redirecionamento unificado após login — respeita o portal retornado pela API.
 */
export function resolveUnifiedLoginRedirect(
  result: LoginSuccessPayload,
  next: string | null | undefined
): string {
  if (result.portal === "admin") {
    return result.redirectTo;
  }

  if (result.portal === "student") {
    return resolveStudentPostLoginPath(next);
  }

  if (result.portal === "support") {
    return resolveSupportPostLoginPath(next) || result.redirectTo || SUPPORT_HOME_PATH;
  }

  return resolveGuardianPostLoginPath(next) || GUARDIAN_HOME_PATH;
}
