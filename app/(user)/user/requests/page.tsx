"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/auth-context";
import { apiLandVerificationsMine, type LandVerificationItem } from "@/lib/api";
import { Eye } from "lucide-react";

function TypeBadge({ type }: { type: string }) {
  const label = type === "forensic_search" ? "Forensic" : "LPC";
  return (
    <Badge variant="outline" className="font-normal">
      {label}
    </Badge>
  );
}

function PaymentStatusBadge() {
  return (
    <Badge variant="outline" className="font-normal text-muted-foreground">
      Pending
    </Badge>
  );
}

export default function MyRequestsPage() {
  const searchParams = useSearchParams();
  const submitted = searchParams.get("submitted") === "1";
  const { token } = useAuth();
  const [data, setData] = useState<{
    verifications: LandVerificationItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    apiLandVerificationsMine(token)
      .then((res) => {
        if (res.success && res.data) setData(res.data);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {submitted && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-foreground sm:px-5">
          Your request has been submitted. You can track its status below. The Ministry will process it and update the status accordingly.
        </div>
      )}
      <div>
        <h2 className="text-lg font-semibold text-foreground sm:text-xl">My Requests</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Track your land verification and LPC requests. Status updates appear here.
        </p>
      </div>

      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-base sm:text-lg">Requests</CardTitle>
          <CardDescription>
            {data ? `${data.total} request${data.total === 1 ? "" : "s"}` : "Your verification and certificate requests."}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          {loading && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Loading…
            </div>
          )}
          {error && (
            <div className="rounded-md border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}
          {!loading && !error && data && data.verifications.length === 0 && (
            <div className="rounded-md border border-border bg-muted/20 py-8 text-center text-sm text-muted-foreground">
              <p>No requests yet.</p>
              <p className="mt-1">
                Start by{" "}
                <Link href="/user/verify-land" className="text-primary underline-offset-4 hover:underline">
                  verifying land
                </Link>{" "}
                or requesting an LPC from the Dashboard.
              </p>
            </div>
          )}
          {!loading && !error && data && data.verifications.length > 0 && (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <Table className="min-w-[500px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Parcel ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Payment Status</TableHead>
                    <TableHead className="w-[100px]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.verifications.map((v) => (
                    <TableRow key={v.id}>
                      <TableCell className="font-medium min-w-[120px]">
                        <span className="break-all">{v.parcelNumber ?? v.parcelId}</span>
                      </TableCell>
                      <TableCell>
                        <TypeBadge type={v.type} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={v.status} />
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <PaymentStatusBadge />
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/user/requests/${v.id}`}>
                            <Eye className="mr-1 h-4 w-4" />
                            View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
