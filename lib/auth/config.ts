function trimOrigin(value: string | undefined): string {
  return value?.trim().replace(/\/$/, "") ?? "";
}

/**
 * Origem do painel admin para handoff demo (`#demo_token=`).
 * Prefere `NEXT_PUBLIC_ADMIN_APP_URL`; cai em `ADMIN_APP_URL`. Sem as duas, retorna null.
 */
export function resolveAdminHandoffUrl(): string | null {
  const publicUrl = trimOrigin(process.env.NEXT_PUBLIC_ADMIN_APP_URL);
  if (publicUrl) return publicUrl;
  const serverUrl = trimOrigin(process.env.ADMIN_APP_URL);
  if (serverUrl) return serverUrl;
  return null;
}

export const authConfig = {
  cookieName: process.env.AUTH_COOKIE_NAME ?? "akili_client_session",
  refreshCookieName:
    process.env.AUTH_REFRESH_COOKIE_NAME ?? "akili_client_refresh",
  secure: process.env.COOKIE_SECURE === "true",
  sameSite: (process.env.COOKIE_SAME_SITE ?? "lax") as "lax" | "strict" | "none",
  adminAppUrl: process.env.ADMIN_APP_URL ?? "http://localhost:3001",
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "Akili",
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
} as const;

export const GUARDIAN_PERMISSION = "dashboards.guardian.view";
