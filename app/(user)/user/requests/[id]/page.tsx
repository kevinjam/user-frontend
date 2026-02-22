"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { apiLandVerificationGetMine, type LandVerificationItem } from "@/lib/api";
import { StatusBadge } from "@/components/ui/status-badge";
import { ArrowLeft } from "lucide-react";

export default function RequestDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { token } = useAuth();
  const [verification, setVerification] = useState<LandVerificationItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !params.id) {
      setLoading(false);
      return;
    }
    apiLandVerificationGetMine(token, params.id)
      .then((res) => {
        if (res.success && res.data) setVerification(res.data);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [token, params.id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/user/requests">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Requests
          </Link>
        </Button>
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (error || !verification) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/user/requests">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Requests
          </Link>
        </Button>
        <Card className="border-destructive/20">
          <CardContent className="pt-6">
            <p className="text-destructive">{error ?? "Request not found."}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const typeLabel = verification.type === "forensic_search" ? "Forensic Search" : "Land Parcel Certificate (LPC)";

  return (
    <div className="space-y-6 sm:space-y-8">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/user/requests">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to My Requests
        </Link>
      </Button>

      <Card className="border-border bg-card shadow-sm min-w-0">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-base sm:text-lg">Request details</CardTitle>
          <CardDescription className="text-sm break-words">
            {typeLabel} · Parcel {verification.parcelNumber ?? verification.parcelId}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-4 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Parcel ID</p>
              <p className="mt-0.5 font-medium break-all">{verification.parcelNumber ?? verification.parcelId}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Type</p>
              <p className="mt-0.5">{typeLabel}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</p>
              <div className="mt-0.5">
                <StatusBadge status={verification.status} />
              </div>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Payment status</p>
              <p className="mt-0.5 text-muted-foreground">Pending</p>
            </div>
            {verification.certificateId && (
              <div className="min-w-0 sm:col-span-2">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Certificate ID</p>
                <p className="mt-0.5 font-mono text-sm break-all">{verification.certificateId}</p>
              </div>
            )}
            {verification.rejectionReason && (
              <div className="sm:col-span-2">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Rejection reason</p>
                <p className="mt-0.5 text-sm">{verification.rejectionReason}</p>
              </div>
            )}
          </div>
          <div className="border-t border-border pt-4 text-xs text-muted-foreground">
            <p>Submitted: {verification.createdAt ? new Date(verification.createdAt).toLocaleString() : "—"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
