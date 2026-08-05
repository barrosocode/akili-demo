import { GUARDIAN_PERMISSION } from "@/lib/auth/config";

export const ROUTE_PERMISSIONS: Record<string, string | string[] | null> = {
  "/": GUARDIAN_PERMISSION,
  "/children": "guardian.children.read",
  "/children/new": null,
  "/purchases": "guardian.purchases.read",
  "/profile": null,
  "/relatorios": GUARDIAN_PERMISSION,
  "/aluno": GUARDIAN_PERMISSION,
  "/terms": null,
};

export function getRoutePermission(pathname: string): string | string[] | null {
  const normalized = pathname.replace(/\/$/, "") || "/";

  if (ROUTE_PERMISSIONS[normalized] !== undefined) {
    return ROUTE_PERMISSIONS[normalized];
  }

  if (normalized.startsWith("/children/")) {
    return "guardian.children.read";
  }

  if (normalized.startsWith("/aluno")) {
    return GUARDIAN_PERMISSION;
  }

  return GUARDIAN_PERMISSION;
}
