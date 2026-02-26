"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  HardHat,
  DraftingCompass,
  ShieldCheck,
  FileCheck,
  Landmark,
  MapPin,
  ArrowRight,
  LogIn,
  UserPlus,
} from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* National colours strip */}
      <div className="flex h-1 w-full shrink-0">
        <div className="h-full flex-1 bg-black" />
        <div className="h-full flex-1 bg-red-600" />
        <div className="h-full flex-1 bg-green-600" />
        <div className="h-full flex-1 bg-blue-700" />
        <div className="h-full flex-1 bg-yellow-400" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
            <span className="text-xl text-primary">UniBuild</span>
            <span className="hidden text-sm text-muted-foreground sm:inline">
              Digital Ecosystem
            </span>
          </Link>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" asChild size="sm">
              <Link href="/login" className="gap-2">
                <LogIn className="h-4 w-4" />
                Sign in
              </Link>
            </Button>
            <Button asChild size="sm" className="gap-2">
              <Link href="/register">
                <UserPlus className="h-4 w-4" />
                Register
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative min-h-[32rem] overflow-hidden border-b border-border sm:min-h-[36rem] md:min-h-[40rem]">
          <Image
            src="/hero.png"
            alt="Modern architecture — built environment for engineers and architects"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"
            aria-hidden
          />
          <div className="container relative z-10 mx-auto flex min-h-[32rem] flex-col justify-center px-4 py-16 text-center sm:min-h-[36rem] sm:py-24 md:min-h-[40rem] md:py-28">
            <p className="mb-3 text-sm font-medium uppercase tracking-wider text-primary-foreground/90">
              Republic of South Sudan
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              Engineers &amp; Architects
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90 sm:text-xl">
              The built environment profession for a growing nation. Register, verify, and deliver
              projects through the UniBuild digital ecosystem.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg" className="gap-2 bg-white text-primary hover:bg-white/90">
                <Link href="/register">
                  Create account
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                size="lg"
                className="border-white/50 bg-transparent text-white hover:bg-white/10"
              >
                <Link href="/login">Sign in</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Professional definitions */}
        <section className="border-b border-border bg-muted/30 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-center text-2xl font-semibold text-foreground sm:text-3xl">
              Professional definition
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-muted-foreground">
              Built environment professionals at the heart of South Sudan&apos;s development.
            </p>
            <div className="mx-auto mt-12 grid max-w-4xl gap-8 sm:grid-cols-2">
              <Card className="overflow-hidden border-border bg-card shadow-sm">
                <div className="h-1 w-full bg-primary" />
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <HardHat className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">Engineers</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="leading-relaxed">
                    Professional engineers are trained in the design, construction, and maintenance
                    of infrastructure and buildings. They prepare structural and technical drawings,
                    oversee construction quality, and certify that works comply with approved
                    designs and national standards—essential for safe, durable development across
                    South Sudan.
                  </p>
                </CardContent>
              </Card>
              <Card className="overflow-hidden border-border bg-card shadow-sm">
                <div className="h-1 w-full bg-secondary" />
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10 text-secondary-foreground">
                      <DraftingCompass className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">Architects</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="leading-relaxed">
                    Architects are professionals trained in the design and construction of buildings
                    and structures that provide shelter and identity. They prepare building plans
                    and designs, coordinate with contractors and consultants, and certify that
                    construction is completed in accordance with approved designs and building
                    standards.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* What UniBuild offers */}
        <section className="border-b border-border py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-center text-2xl font-semibold text-foreground sm:text-3xl">
              What UniBuild offers
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-muted-foreground">
              One portal for verification, design submission, permits, and land services.
            </p>
            <div className="mx-auto mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="border-border bg-card">
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">Profile verification</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Submit your professional profile and documents for institutional verification and
                  approval.
                </CardContent>
              </Card>
              <Card className="border-border bg-card">
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileCheck className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">Design submission</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Upload building and engineering designs for compliance review and code check within
                  the ecosystem.
                </CardContent>
              </Card>
              <Card className="border-border bg-card">
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Landmark className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">Permit requests</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Request permits and approvals linked to your verified profile and compliant
                  designs.
                </CardContent>
              </Card>
              <Card className="border-border bg-card">
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">Land &amp; verification</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Access land registry–linked services and verification tools for citizens and
                  professionals.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary py-16 text-primary-foreground sm:py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-semibold sm:text-3xl">
              Ready to get started?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-primary-foreground/90">
              Register as an Engineer or Architect to submit your profile, upload documents, and
              access the full UniBuild ecosystem.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="gap-2 bg-white text-primary hover:bg-white/90"
              >
                <Link href="/register">
                  Create account
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10">
                <Link href="/login">Sign in</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/40 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-center sm:text-left">
              <p className="font-medium text-foreground">UniBuild</p>
              <p className="text-sm text-muted-foreground">
                Digital ecosystem for engineers, architects, and land services — Republic of South
                Sudan.
              </p>
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/login" className="text-muted-foreground hover:text-foreground">
                Sign in
              </Link>
              <Link href="/register" className="text-muted-foreground hover:text-foreground">
                Register
              </Link>
            </div>
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} UniBuild. For authorised use within the Land Registry
            &amp; UniBuild ecosystem.
          </p>
        </div>
      </footer>
    </div>
  );
}
