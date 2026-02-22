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
import { Badge } from "@/components/ui/badge";
import {
  apiDesignSubmissionMine,
  apiPermitRequestCreate,
  apiPermitRequestMine,
  type DesignSubmissionData,
  type PermitRequestData,
} from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";
import { StatusBadge } from "@/components/ui/status-badge";
import { FileCheck, Loader2, AlertTriangle } from "lucide-react";

// TODO: replace with API (e.g. GET /api/professional-profile/me or membership API)
const MOCK_MEMBERSHIP_PAID = false;

function feeFromProjectValue(projectValue: number): number {
  return Math.round(projectValue * 0.01 * 100) / 100;
}

export default function PermitRequestsPage() {
  const { token } = useAuth();
  const membershipPaid = MOCK_MEMBERSHIP_PAID;
  const [submissions, setSubmissions] = useState<DesignSubmissionData[]>([]);
  const [permitRequests, setPermitRequests] = useState<PermitRequestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const load = () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    Promise.all([
      apiDesignSubmissionMine(token),
      apiPermitRequestMine(token),
    ])
      .then(([subRes, permRes]) => {
        if (subRes.success) setSubmissions(subRes.data.submissions);
        if (permRes.success) setPermitRequests(permRes.data.permitRequests);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [token]);

  const designIdsWithRequest = new Set(
    permitRequests
      .filter((pr) => pr.status === "pending_government_approval" || pr.status === "approved")
      .map((pr) => pr.designSubmissionId)
  );

  const passedDesigns = submissions.filter((s) => s.complianceStatus === "passed");
  const canRequestPermit = membershipPaid
    ? passedDesigns.filter((d) => !designIdsWithRequest.has(d.id))
    : [];

  const handleRequestPermit = async (designSubmissionId: string) => {
    if (!token || !membershipPaid) return;
    setError(null);
    setSubmittingId(designSubmissionId);
    try {
      await apiPermitRequestCreate(token, { designSubmissionId });
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setSubmittingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Permit Requests</h2>
        <p className="text-sm text-muted-foreground">
          Track building or development permit requests. Request a permit when your design compliance is Passed.
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      {!membershipPaid && (
        <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <div>
            <p className="font-medium">Membership payment required</p>
            <p className="mt-0.5 text-sm">
              Permit requests are disabled until your annual membership fee is paid. Go to{" "}
              <Link href="/professional/membership" className="underline underline-offset-2 font-medium">
                Membership Status
              </Link>{" "}
              to pay the $30 annual fee.
            </p>
          </div>
        </div>
      )}

      {membershipPaid && canRequestPermit.length > 0 && (
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileCheck className="h-4 w-4 text-primary" />
              Permit-ready designs
            </CardTitle>
            <CardDescription>
              Designs with compliance Passed can request a permit. Fee is 1% of project value.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {canRequestPermit.map((design) => (
              <div
                key={design.id}
                className="flex flex-col gap-3 rounded-lg border border-border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-foreground">{design.projectName}</p>
                  <p className="text-sm text-muted-foreground">
                    {design.location} · Project value: ${design.projectValue.toLocaleString()}
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    Permit fee (1% of project value): ${feeFromProjectValue(design.projectValue).toLocaleString()}
                  </p>
                </div>
                <Button
                  onClick={() => handleRequestPermit(design.id)}
                  disabled={!!submittingId}
                  className="shrink-0"
                >
                  {submittingId === design.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Request Permit-Ready"
                  )}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {passedDesigns.length === 0 && (
        <Card className="border-border bg-card shadow-sm">
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            <p>No designs with compliance Passed yet.</p>
            <Link href="/professional/design" className="mt-2 inline-block text-primary hover:underline">
              Upload a design →
            </Link>
          </CardContent>
        </Card>
      )}

      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Your permit requests</CardTitle>
          <CardDescription>
            Status: Pending Government Approval · Approved · Rejected
          </CardDescription>
        </CardHeader>
        <CardContent>
          {permitRequests.length === 0 ? (
            <div className="rounded-md border border-border bg-muted/20 py-8 text-center text-sm text-muted-foreground">
              <p>No permit requests yet.</p>
              <p className="mt-1">
                Request a permit from a design with compliance Passed above.
              </p>
              <Link href="/professional/design" className="mt-3 inline-block text-sm text-primary hover:underline">
                Upload a design first →
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {permitRequests.map((pr) => (
                <li
                  key={pr.id}
                  className="flex flex-col gap-2 rounded-lg border border-border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-foreground">{pr.projectName ?? "Design"}</p>
                    <p className="text-sm text-muted-foreground">
                      {pr.location ?? ""} · Fee: ${pr.feeAmount.toLocaleString()}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <StatusBadge status={pr.status} />
                      {pr.status === "approved" && pr.permitNumber != null && pr.permitNumber !== "" && (
                        <Badge variant="outline" className="font-mono">
                          Permit #{pr.permitNumber}
                        </Badge>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
