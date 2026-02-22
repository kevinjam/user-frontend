/**
 * Role-based route protection config.
 * Used by AuthGuard and middleware to protect /user/* and /professional/*.
 */

export const ROUTES = {
  login: "/login",
  register: "/register",
  home: "/",
} as const;

/** Path prefixes that require authentication. Middleware redirects to login if no auth cookie. */
export const PROTECTED_PATH_PREFIXES = ["/user", "/professional"] as const;

export type ProtectedPathPrefix = (typeof PROTECTED_PATH_PREFIXES)[number];

/** Roles that can access each protected area. Client guard redirects to correct dashboard if role doesn't match. */
export const PATH_ROLE_MAP: Record<ProtectedPathPrefix, readonly string[]> = {
  "/user": ["CITIZEN"],
  "/professional": ["ARCHITECT", "ENGINEER"],
} as const;

/** Cookie set on login/register so middleware can redirect unauthenticated users before the page loads. */
export const AUTH_COOKIE_NAME = "unibuild_auth";
