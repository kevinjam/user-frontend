import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, User, Briefcase } from "lucide-react";

const governmentDashboardUrl =
  process.env.NEXT_PUBLIC_GOVERNMENT_DASHBOARD_URL ?? "http://localhost:3001";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <header className="border-b border-border bg-card px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <h1 className="text-lg font-semibold text-foreground">
            UniBuild Digital Ecosystem
          </h1>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-16">
        <h2 className="mb-2 text-2xl font-semibold text-foreground">
          Welcome to UniBuild Digital Ecosystem
        </h2>
        <p className="mb-10 text-center text-muted-foreground">
          Select your role to continue.
        </p>
        <div className="grid w-full gap-4 sm:grid-cols-3">
          <Card className="bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Government Admin</CardTitle>
              <CardDescription>Administrative access and oversight (separate app)</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant="default">
                <Link href={governmentDashboardUrl} target="_blank" rel="noopener noreferrer">
                  <Building2 className="mr-2 h-4 w-4" />
                  Open Dashboard
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Citizen User</CardTitle>
              <CardDescription>Access citizen services and applications</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant="default">
                <Link href="/login?role=user">
                  <User className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Professional</CardTitle>
              <CardDescription>Professional and business portal</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant="default">
                <Link href="/login?role=professional">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary underline-offset-4 hover:underline">
            Register as User or Professional
          </Link>
        </p>
      </main>
    </div>
  );
}
