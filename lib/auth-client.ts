"use client";

import { AUTH_COOKIE_NAME } from "./route-protection";

const TOKEN_KEY = "unibuild_token";
const USER_KEY = "unibuild_user";
const AUTH_COOKIE_MAX_AGE_DAYS = 7;

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  roles: string[];
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function setStoredAuth(token: string, user: AuthUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  document.cookie = `${AUTH_COOKIE_NAME}=1; path=/; max-age=${AUTH_COOKIE_MAX_AGE_DAYS * 86400}; SameSite=Lax`;
}

export function clearStoredAuth(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0`;
}

/** CITIZEN/USER → user dashboard; ARCHITECT/ENGINEER → professional dashboard */
export function getDashboardPath(roles: string[]): string {
  if (!Array.isArray(roles) || roles.length === 0) {
    return "/user/dashboard";
  }
  const normalized = roles.map((r) => (r || "").toUpperCase());
  const isProfessional = normalized.some((r) =>
    ["ARCHITECT", "ENGINEER"].includes(r)
  );
  return isProfessional ? "/professional/dashboard" : "/user/dashboard";
}
