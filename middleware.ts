import { NextResponse, type NextRequest } from "next/server";
import { hasSessionCookie } from "@/lib/auth/cookies";
import { hasStudentSessionCookie } from "@/lib/auth/student-cookies";
import { hasSupportSessionCookie } from "@/lib/auth/support-cookies";
import { isAuthPath, isPublicPath } from "@/lib/auth/public-routes";
import { SUPPORT_LOGIN_PATH } from "@/lib/auth/support-config";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/suporte/entrar")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/suporte")) {
    const hasSupport =
      (await hasSupportSessionCookie()) || (await hasSessionCookie());
    if (!hasSupport) {
      const loginUrl = new URL(SUPPORT_LOGIN_PATH, request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/aluno/entrar")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/aluno/supervisao")) {
    const hasGuardianSession = await hasSessionCookie();
    if (!hasGuardianSession) {
      const signInUrl = new URL("/signin", request.url);
      signInUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(signInUrl);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/aluno")) {
    const hasStudentSession = await hasStudentSessionCookie();
    if (!hasStudentSession) {
      const loginUrl = new URL("/aluno/entrar", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Auth pages always reachable (avoids bounce with stale session cookies).
  if (isAuthPath(pathname)) {
    return NextResponse.next();
  }

  const hasSession = await hasSessionCookie();

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (!hasSession) {
    const signInUrl = new URL("/signin", request.url);
    signInUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
