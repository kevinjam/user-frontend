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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth-context";
import { getDashboardPath } from "@/lib/auth-client";

function RegisterFormSkeleton() {
  return (
    <Card className="border-border bg-card shadow-md">
      <CardHeader className="space-y-2 sm:px-6 sm:pt-6 md:px-8 md:pt-8">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-full max-w-md" />
        <Skeleton className="h-4 w-full max-w-sm" />
      </CardHeader>
      <CardContent className="space-y-4 sm:px-6 md:px-8 md:pb-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-9 w-full" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="flex items-start gap-2">
          <Skeleton className="h-4 w-4 shrink-0 rounded" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-3 w-72" />
          </div>
        </div>
        <Skeleton className="h-10 w-full" />
        <div className="flex justify-center">
          <Skeleton className="h-4 w-48" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { register: doRegister, user, isLoading, isAuthenticated } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"USER" | "ARCHITECT" | "ENGINEER">("USER");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoading && isAuthenticated && user) {
    router.replace(getDashboardPath(user.roles));
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!termsAccepted) {
      setError("You must accept the Terms of Service to register.");
      return;
    }
    setIsSubmitting(true);
    try {
      await doRegister({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        role,
        termsAccepted: true,
      });
      const path = role === "USER" ? "/user/dashboard" : "/professional/dashboard";
      router.replace(path);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <RegisterFormSkeleton />;
  }

  return (
    <Card className="border-border bg-card shadow-md">
      <CardHeader className="space-y-1 px-4 pt-6 sm:px-6 sm:pt-6 md:px-8 md:pt-8">
        <CardTitle className="text-xl font-semibold sm:text-2xl">Create an account</CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Enter your details. Choose your role: User (Citizen), Architect, or Engineer. Architects and Engineers use the same form but are managed by different bodies.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-6 sm:px-6 sm:pb-6 md:px-8 md:pb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-background"
                autoComplete="name"
              />
            </div>
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
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+211 123 456 789"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="bg-background"
                autoComplete="tel"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="bg-background"
                autoComplete="new-password"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select
              value={role}
              onValueChange={(v) => setRole(v as "USER" | "ARCHITECT" | "ENGINEER")}
            >
              <SelectTrigger className="w-full bg-background">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">User (Citizen)</SelectItem>
                <SelectItem value="ARCHITECT">Architect</SelectItem>
                <SelectItem value="ENGINEER">Engineer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-start gap-2 space-y-0">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked === true)}
              aria-describedby="terms-description"
              className="mt-0.5"
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="terms"
                className="text-sm font-normal cursor-pointer"
              >
                I accept the Terms of Service and Privacy Policy
              </Label>
              <p id="terms-description" className="text-xs text-muted-foreground">
                You must accept the terms to register. Submission is disabled until checked.
              </p>
            </div>
          </div>
          {error && (
            <div className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !termsAccepted}
          >
            {isSubmitting ? "Creating account…" : "Register"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
