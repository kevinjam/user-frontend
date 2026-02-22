import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROUTES, PROTECTED_PATH_PREFIXES, AUTH_COOKIE_NAME } from "@/lib/route-protection";

/**
 * Protects /user/* and /professional/*:
 * - No auth cookie → redirect to login.
 * - Auth cookie present → allow (role check done by client AuthGuard).
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATH_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  if (!isProtected) {
    return NextResponse.next();
  }

  const hasAuthCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!hasAuthCookie) {
    const loginUrl = new URL(ROUTES.login, request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/user/:path*", "/professional/:path*"],
};
