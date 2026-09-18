import { GUARDIAN_PERMISSION } from "@/lib/auth/config";

/**
 * Permissões do portal do responsável.
 * `/aluno` (exceto supervisão) não é rota guardian — sessão student.
 */
export const ROUTE_PERMISSIONS: Record<string, string | string[] | null> = {
  "/": GUARDIAN_PERMISSION,
  "/children": "guardian.children.read",
  "/children/new": null,
  "/purchases": "guardian.purchases.read",
  "/profile": null,
  "/relatorios": GUARDIAN_PERMISSION,
  "/ajuda": GUARDIAN_PERMISSION,
  "/terms": null,
};

export function getRoutePermission(pathname: string): string | string[] | null {
  const normalized = pathname.replace(/\/$/, "") || "/";

  if (ROUTE_PERMISSIONS[normalized] !== undefined) {
    return ROUTE_PERMISSIONS[normalized];
  }

  if (normalized.startsWith("/ajuda/")) {
    return GUARDIAN_PERMISSION;
  }

  if (normalized.startsWith("/children/")) {
    return "guardian.children.read";
  }

  if (normalized.startsWith("/aluno/supervisao")) {
    return GUARDIAN_PERMISSION;
  }

  if (normalized.startsWith("/aluno")) {
    return null;
  }

  return GUARDIAN_PERMISSION;
}
