"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  BadgeCheck,
  Calendar,
  PenTool,
  FileCheck,
  FileUp,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

// Placeholder data until backend provides professional verification, membership, designs, permits
const MOCK_VERIFICATION_STATUS: "pending" | "approved" = "pending";
const MOCK_MEMBERSHIP_EXPIRY = "2026-12-31";
const MOCK_DESIGN_SUBMISSIONS = 0;
const MOCK_PERMIT_SUMMARY = { pending: 0, approved: 0, rejected: 0 };

export default function ProfessionalDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="rounded-lg border border-border bg-card px-4 py-3 shadow-sm sm:px-5 sm:py-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground sm:text-sm">
          Professional Portal · Engineer / Architect
        </p>
        <h2 className="mt-1 text-lg font-semibold text-foreground sm:mt-2 sm:text-xl">
          Dashboard Overview
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground sm:mt-1">
          Welcome back{user?.name ? `, ${user.name}` : ""}. Track your verification, designs, and permits.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Verification status
            </CardTitle>
            <BadgeCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <StatusBadge
                status={MOCK_VERIFICATION_STATUS === "approved" ? "approved" : "pending"}
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              ECOSS registration and document review
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Membership expiry
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">
              {MOCK_MEMBERSHIP_EXPIRY
                ? new Date(MOCK_MEMBERSHIP_EXPIRY).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "—"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Renew via Membership Status
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Design submissions
            </CardTitle>
            <PenTool className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-foreground">
              {MOCK_DESIGN_SUBMISSIONS}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Total designs uploaded
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Permit status
            </CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              <Badge className="bg-amber-500 text-white hover:bg-amber-500 border-0">
                Pending {MOCK_PERMIT_SUMMARY.pending}
              </Badge>
              <Badge className="bg-emerald-600 text-white hover:bg-emerald-600 border-0">
                Approved {MOCK_PERMIT_SUMMARY.approved}
              </Badge>
              <Badge className="bg-red-600 text-white hover:bg-red-600 border-0">
                Rejected {MOCK_PERMIT_SUMMARY.rejected}
              </Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              <Link href="/professional/permits" className="text-primary hover:underline">
                View permit requests
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/20 bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Get started</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Complete your journey: Submit Documents → Await Approval → Upload Design → Request Permit → Track Status
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild variant="outline" size="sm">
            <Link href="/professional/register">
              ECOSS registration form
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/professional/documents">
              <FileUp className="mr-2 h-4 w-4" />
              Submit documents
            </Link>
          </Button>
          <Button asChild variant="secondary" size="sm">
            <Link href="/professional/design">
              <PenTool className="mr-2 h-4 w-4" />
              Upload design
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground sm:px-5 sm:py-4">
        <p className="font-medium text-foreground">Your journey</p>
        <p className="mt-1 sm:mt-2">
          Signup → Submit Documents → Await Approval → Upload Design → Request Permit → Track Status
        </p>
      </div>
    </div>
  );
}
