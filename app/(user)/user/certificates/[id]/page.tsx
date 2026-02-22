"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { useAuth } from "@/contexts/auth-context";
import { apiLandVerificationGetMine, type LandVerificationItem } from "@/lib/api";
import { ArrowLeft, Download, Shield } from "lucide-react";

function MinistrySeal() {
  return (
    <div className="flex justify-center">
      <div
        className="relative flex h-28 w-28 flex-col items-center justify-center rounded-full border-4 border-primary bg-primary/10 shadow-md ring-2 ring-primary/20"
        aria-hidden
      >
        <Shield className="h-11 w-11 text-primary" />
        <span className="mt-1 text-[10px] font-bold uppercase tracking-widest text-primary">
          Ministry
        </span>
        <span className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
          Seal
        </span>
      </div>
    </div>
  );
}

export default function CertificateDisplayPage({
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

  const isApprovedLpc =
    verification?.type === "lpc" && verification?.status === "approved";
  const approvedAt = verification?.approvedAt as string | undefined;

  if (loading) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/user/certificates">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Certificates
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
          <Link href="/user/certificates">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Certificates
          </Link>
        </Button>
        <Card className="border-destructive/20">
          <CardContent className="pt-6">
            <p className="text-destructive">{error ?? "Certificate not found."}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isApprovedLpc) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/user/certificates">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Certificates
          </Link>
        </Button>
        <Card className="border-border">
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              This certificate is only available for approved Land Parcel Certificate (LPC) requests. Current status: {verification.status}.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full min-w-0 max-w-2xl space-y-6 px-0 sm:space-y-8">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/user/certificates">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Certificates
        </Link>
      </Button>

      <Card className="overflow-hidden border-2 border-primary/20 bg-card shadow-lg print:shadow-none min-w-0">
        <CardHeader className="space-y-4 border-b border-border bg-muted/20 px-4 py-6 text-center sm:px-6">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Republic of South Sudan
          </p>
          <p className="text-sm font-semibold text-foreground">
            Ministry of Lands
          </p>
          <CardTitle className="text-base sm:text-lg">Land Parcel Certificate (LPC)</CardTitle>
          <div className="pt-2">
            <MinistrySeal />
          </div>
        </CardHeader>
        <CardContent className="space-y-6 px-4 pt-6 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Verification ID
              </p>
              <p className="mt-0.5 font-mono text-sm font-medium break-all">
                {verification.certificateId ?? verification.id}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Status
              </p>
              <div className="mt-0.5">
                <StatusBadge status="approved" />
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Parcel information
            </p>
            <dl className="mt-2 grid gap-2 sm:grid-cols-2">
              <div className="min-w-0">
                <dt className="text-xs text-muted-foreground">Parcel number</dt>
                <dd className="font-medium break-words">{verification.parcelNumber ?? verification.parcelId}</dd>
              </div>
              {verification.town && (
                <div>
                  <dt className="text-xs text-muted-foreground">Town</dt>
                  <dd className="font-medium">{String(verification.town)}</dd>
                </div>
              )}
              {verification.blockNumber && (
                <div>
                  <dt className="text-xs text-muted-foreground">Block</dt>
                  <dd className="font-medium">{String(verification.blockNumber)}</dd>
                </div>
              )}
              {verification.propertyOf && (
                <div>
                  <dt className="text-xs text-muted-foreground">Property of</dt>
                  <dd className="font-medium">{String(verification.propertyOf)}</dd>
                </div>
              )}
              {verification.location && (
                <div className="sm:col-span-2">
                  <dt className="text-xs text-muted-foreground">Location</dt>
                  <dd className="font-medium">{String(verification.location)}</dd>
                </div>
              )}
              {verification.areaSqm != null && (
                <div>
                  <dt className="text-xs text-muted-foreground">Area (m²)</dt>
                  <dd className="font-medium">{String(verification.areaSqm)}</dd>
                </div>
              )}
            </dl>
          </div>

          {approvedAt && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Approval timestamp
              </p>
              <p className="mt-0.5 font-medium">
                {new Date(approvedAt).toLocaleString(undefined, {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </p>
            </div>
          )}

          {verification.status === "approved" && (
            <div className="flex justify-center pt-4">
              <Button variant="outline" className="gap-2" disabled>
                <Download className="h-4 w-4" />
                Download PDF (placeholder)
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <footer className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-center text-xs text-muted-foreground sm:px-5">
        Information provided for guidance only. Refer to official Ministry records for legal finality.
      </footer>
    </div>
  );
}
