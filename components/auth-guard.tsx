"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { getDashboardPath } from "@/lib/auth-client";
import { ROUTES } from "@/lib/route-protection";

type AllowedRole = "CITIZEN" | "ARCHITECT" | "ENGINEER";

/** Normalize role for comparison: uppercase, and treat USER as CITIZEN. */
function normalizeRole(r: string): string {
  const u = (r || "").toUpperCase();
  return u === "USER" ? "CITIZEN" : u;
}

/** Safe roles array: always an array, default to CITIZEN if missing/empty. */
function getRoles(user: { roles?: unknown } | null): string[] {
  if (!user) return [];
  const r = user.roles;
  if (Array.isArray(r) && r.length > 0) {
    return r.filter((x): x is string => typeof x === "string");
  }
  return ["CITIZEN"];
}

function userHasAllowedRole(userRoles: string[], allowedRoles: readonly string[]): boolean {
  const allowedUpper = allowedRoles.map((a) => (a || "").toUpperCase());
  if (userRoles.length === 0) return allowedUpper.includes("CITIZEN");
  return userRoles.some((r) => allowedUpper.includes(normalizeRole(r)));
}

/**
 * Client-side guard for role-based dashboards. Use in layouts for /user/* and /professional/*.
 * 1. Not authenticated → redirect to login.
 * 2. Authenticated but wrong section → redirect to correct dashboard (CITIZEN/USER → /user, ARCHITECT/ENGINEER → /professional).
 * 3. If already in the correct section (/user/* or /professional/*), show content so all dashboard pages load.
 */
export function AuthGuard({
  children,
  allowedRoles,
  loadingPlaceholder,
}: {
  children: React.ReactNode;
  allowedRoles: AllowedRole[];
  loadingPlaceholder?: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, isAuthenticated } = useAuth();
  const redirectAttempted = useRef(false);

  const roles = getRoles(user);
  const targetPath = user ? getDashboardPath(roles) : ROUTES.login;
  const hasRole = user && userHasAllowedRole(roles, allowedRoles);
  const userSection = targetPath.startsWith("/user") ? "/user" : "/professional";
  const isOnCorrectSection = pathname === targetPath || pathname.startsWith(`${userSection}/`);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated || !user) {
      router.replace(ROUTES.login);
      return;
    }
    if (hasRole || isOnCorrectSection) return;
    if (redirectAttempted.current) return;
    redirectAttempted.current = true;
    router.replace(targetPath);
  }, [isLoading, isAuthenticated, user, hasRole, isOnCorrectSection, targetPath, router]);

  if (isLoading || !isAuthenticated || !user) {
    if (loadingPlaceholder) {
      return <>{loadingPlaceholder}</>;
    }
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!hasRole && !isOnCorrectSection) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <p className="text-muted-foreground">Redirecting to your dashboard…</p>
      </div>
    );
  }

  return <>{children}</>;
}
