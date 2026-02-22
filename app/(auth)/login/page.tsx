"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth-context";
import { getDashboardPath } from "@/lib/auth-client";
import { PROTECTED_PATH_PREFIXES } from "@/lib/route-protection";

function getRedirectAfterLogin(): string | null {
  if (typeof window === "undefined") return null;
  const from = new URLSearchParams(window.location.search).get("from");
  if (!from || !from.startsWith("/")) return null;
  const isProtected = PROTECTED_PATH_PREFIXES.some((p) => from.startsWith(p));
  return isProtected ? from : null;
}

function LoginFormSkeleton() {
  return (
    <Card className="border-border bg-card shadow-md">
      <CardHeader className="space-y-2 px-4 pt-6 sm:px-6 md:px-8">
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent className="space-y-4 px-4 pb-6 sm:px-6 md:px-8 md:pb-8">
        <div className="space-y-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-9 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
        <div className="flex justify-center">
          <Skeleton className="h-4 w-44" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { login, user, isLoading, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoading && isAuthenticated && user) {
    const target = getRedirectAfterLogin() ?? getDashboardPath(user.roles);
    router.replace(target);
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const loggedInUser = await login(email.trim(), password);
      const target = getRedirectAfterLogin() ?? getDashboardPath(loggedInUser.roles);
      router.replace(target);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoginFormSkeleton />;
  }

  return (
    <Card className="border-border bg-card shadow-md">
      <CardHeader className="space-y-1 px-4 pt-6 sm:px-6 md:px-8">
        <CardTitle className="text-xl font-semibold sm:text-2xl">Sign in</CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Enter your credentials to access your dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-6 sm:px-6 md:px-8 md:pb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background"
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-background"
              autoComplete="current-password"
            />
          </div>
          {error && (
            <div className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary underline-offset-4 hover:underline">
            Register
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
