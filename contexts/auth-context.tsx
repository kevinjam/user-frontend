"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  getStoredToken,
  getStoredUser,
  setStoredAuth,
  clearStoredAuth,
  getDashboardPath,
  type AuthUser,
} from "@/lib/auth-client";
import { apiLogin, apiRegister, apiMe } from "@/lib/api";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (body: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: "USER" | "ARCHITECT" | "ENGINEER";
    termsAccepted: boolean;
  }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  dashboardPath: string | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = getStoredToken();
    const u = getStoredUser();
    if (t && u) {
      setToken(t);
      setUser(u);
      apiMe(t)
        .then((res) => {
          if (res.success && res.data.user) {
            setUser(res.data.user);
            setStoredAuth(t, res.data.user);
          }
        })
        .catch(() => {
          clearStoredAuth();
          setToken(null);
          setUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AuthUser> => {
    const res = await apiLogin(email, password);
    if (!res.success || !res.data) throw new Error("Login failed");
    setToken(res.data.token);
    setUser(res.data.user);
    setStoredAuth(res.data.token, res.data.user);
    return res.data.user;
  }, []);

  const register = useCallback(
    async (body: {
      name: string;
      email: string;
      phone: string;
      password: string;
      role: "USER" | "ARCHITECT" | "ENGINEER";
      termsAccepted: boolean;
    }) => {
      const res = await apiRegister(body);
      if (res.success && res.data) {
        setToken(res.data.token);
        setUser(res.data.user);
        setStoredAuth(res.data.token, res.data.user);
      }
    },
    []
  );

  const logout = useCallback(() => {
    clearStoredAuth();
    setToken(null);
    setUser(null);
  }, []);

  const dashboardPath = user ? getDashboardPath(user.roles) : null;

  const value: AuthContextValue = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user,
    dashboardPath,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
