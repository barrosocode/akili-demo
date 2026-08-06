import type { LoginSuccessPayload } from "@/types/auth-login";
import { STUDENT_DEFAULT_PATH } from "@/lib/auth/portal-destination";

/**
 * Destino pós-login: path relativo interno seguro, ou dashboard `/`.
 * Rejeita URLs absolutas, protocol-relative (`//`) e vazios.
 */
export function resolvePostLoginPath(next: string | null | undefined): string {
  if (!next || typeof next !== "string") return "/";

  const trimmed = next.trim();
  if (!trimmed.startsWith("/")) return "/";
  if (trimmed.startsWith("//")) return "/";
  if (trimmed.includes("://")) return "/";

  return trimmed;
}

function resolveStudentPostLoginPath(next: string | null | undefined): string {
  const safeNext = resolvePostLoginPath(next);
  if (safeNext.startsWith("/aluno") || safeNext.startsWith("/student")) {
    return safeNext.startsWith("/student/dashboard")
      ? STUDENT_DEFAULT_PATH
      : safeNext;
  }
  return STUDENT_DEFAULT_PATH;
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

  return resolvePostLoginPath(next);
}
