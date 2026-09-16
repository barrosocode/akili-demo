const PUBLIC_PATHS = [
  "/",
  "/checkout",
  "/signin",
  "/forgot-password",
  "/first-access",
  "/invite",
  "/sobre-nos",
  "/series",
  "/blog",
  "/preco-e-planos",
  "/faq",
  "/cadastro",
  "/contato",
  "/newsletter",
  "/assistance/adopt",
] as const;

const PUBLIC_PREFIXES = [
  "/api/auth/login",
  "/api/auth/signup",
  "/api/auth/invite",
  "/api/auth/otp",
  "/api/assistance/",
  "/blog/",
  "/guardian/invite",
] as const;

export function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname as (typeof PUBLIC_PATHS)[number])) {
    return true;
  }

  if (pathname.startsWith("/api/auth/login")) return true;
  if (pathname.startsWith("/api/auth/signup")) return true;
  if (pathname.startsWith("/api/auth/invite")) return true;
  if (pathname.startsWith("/api/auth/otp")) return true;
  if (pathname.startsWith("/api/assistance/")) return true;
  if (pathname.startsWith("/api/student/auth/login")) return true;
  if (pathname.startsWith("/api/checkout")) return true;
  if (pathname.startsWith("/guardian/invite")) return true;
  if (pathname.startsWith("/assistance/adopt")) return true;

  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function isAuthPath(pathname: string): boolean {
  return (
    pathname.startsWith("/signin") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/first-access") ||
    pathname.startsWith("/invite") ||
    pathname.startsWith("/guardian/invite")
  );
}
