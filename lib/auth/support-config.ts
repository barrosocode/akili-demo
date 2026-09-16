import { authConfig } from "@/lib/auth/config";

export const SUPPORT_ASSISTANCE_START_PERMISSION =
  "support.users.assistance.start" as const;

export const SUPPORT_USERS_READ_PERMISSION = "support.users.read" as const;

export const SUPPORT_HOME_PATH = "/suporte";
export const SUPPORT_LOGIN_PATH = "/suporte/entrar";

export const supportAuthConfig = {
  cookieName:
    process.env.AUTH_SUPPORT_COOKIE_NAME ?? "akili_support_session",
  refreshCookieName:
    process.env.AUTH_SUPPORT_REFRESH_COOKIE_NAME ?? "akili_support_refresh",
  secure: authConfig.secure,
  sameSite: authConfig.sameSite,
} as const;
