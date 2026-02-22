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
import { MapPin, FileText, Clock, Award } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

// TODO: replace with API when backend exposes "my verifications" for citizens
const MOCK_STATS = {
  totalVerifications: 0,
  pendingRequests: 0,
  approvedLpc: 0,
};

export default function UserDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header — South Sudan institutional */}
      <div className="rounded-lg border border-border bg-card px-4 py-3 shadow-sm sm:px-5 sm:py-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground sm:text-sm">
          Republic of South Sudan · Ministry of Lands
        </p>
        <h2 className="mt-1 text-lg font-semibold text-foreground sm:mt-2 sm:text-xl">
          Land Verification Services
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground sm:mt-1">
          Welcome back{user?.name ? `, ${user.name}` : ""}. Manage your land verification requests and certificates.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border bg-card shadow-sm min-w-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total verifications
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-foreground">
              {MOCK_STATS.totalVerifications}
            </p>
            <p className="text-xs text-muted-foreground">
              All land verification requests
            </p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card shadow-sm min-w-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending requests
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-foreground">
              {MOCK_STATS.pendingRequests}
            </p>
            <p className="text-xs text-muted-foreground">
              Awaiting review or payment
            </p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card shadow-sm min-w-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Approved LPC
            </CardTitle>
            <Award className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-foreground">
              {MOCK_STATS.approvedLpc}
            </p>
            <p className="text-xs text-muted-foreground">
              Land Parcel Certificates issued
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick action */}
      <Card className="border-primary/20 bg-card shadow-sm min-w-0">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-base sm:text-lg">Verify land or request certificate</CardTitle>
          <CardDescription className="text-sm">
            Start a forensic search or request a Land Parcel Certificate (LPC) for your parcel. You can track progress under My Requests.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <Button asChild size="lg" className="w-full bg-primary hover:bg-primary/90 sm:w-auto">
            <Link href="/user/verify-land">
              <MapPin className="mr-2 h-4 w-4" />
              Verify Land
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Short journey reminder */}
      <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground sm:px-5 sm:py-4">
        <p className="font-medium text-foreground">Your journey</p>
        <p className="mt-1 sm:mt-2">
          Signup → Dashboard → Verify Land → Pay → View Result → Download Certificate → Track History
        </p>
      </div>
    </div>
  );
}
