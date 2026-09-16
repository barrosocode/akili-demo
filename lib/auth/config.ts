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
  assistanceCookieName:
    process.env.AUTH_ASSISTANCE_COOKIE_NAME ?? "akili_assistance_session",
  supportCookieName:
    process.env.AUTH_SUPPORT_COOKIE_NAME ?? "akili_support_session",
  supportRefreshCookieName:
    process.env.AUTH_SUPPORT_REFRESH_COOKIE_NAME ?? "akili_support_refresh",
  secure: process.env.COOKIE_SECURE === "true",
  sameSite: (process.env.COOKIE_SAME_SITE ?? "lax") as "lax" | "strict" | "none",
  adminAppUrl: process.env.ADMIN_APP_URL ?? "http://localhost:3000",
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "Akili",
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001",
} as const;

/** Destino pós-encerramento quando a mesa de suporte do Portal está autenticada. */
export const ASSISTANCE_SUPPORT_DESK_RETURN_PATH = "/suporte";

/** Destino pós-encerramento / expiração da assistência (Admin, fluxo legado). */
export function resolveAssistanceAdminReturnUrl(): string {
  const origin = resolveAdminHandoffUrl() ?? authConfig.adminAppUrl;
  return `${origin.replace(/\/$/, "")}/support`;
}

export const GUARDIAN_PERMISSION = "dashboards.guardian.view";
