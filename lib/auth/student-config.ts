export const studentAuthConfig = {
  cookieName: process.env.STUDENT_AUTH_COOKIE_NAME ?? "akili_student_session",
  refreshCookieName:
    process.env.STUDENT_AUTH_REFRESH_COOKIE_NAME ?? "akili_student_refresh",
  secure: process.env.COOKIE_SECURE === "true",
  sameSite: (process.env.COOKIE_SAME_SITE ?? "lax") as "lax" | "strict" | "none",
} as const;
