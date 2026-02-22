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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Award, FileText } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { apiLandVerificationsMine, type LandVerificationItem } from "@/lib/api";

export default function CertificatesPage() {
  const { token } = useAuth();
  const [certificates, setCertificates] = useState<LandVerificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    apiLandVerificationsMine(token, { type: "lpc", status: "approved" })
      .then((res) => {
        if (res.success && res.data) setCertificates(res.data.verifications);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground sm:text-xl">Certificates</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          View and download your issued Land Parcel Certificates (LPC). Certificates are available after approval.
        </p>
      </div>

      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Award className="h-4 w-4 shrink-0 text-primary" />
            Land Parcel Certificates
          </CardTitle>
          <CardDescription>
            {certificates.length > 0
              ? `${certificates.length} approved certificate${certificates.length === 1 ? "" : "s"}`
              : "Approved LPC requests appear here. Open a certificate to view or download."}
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
          {!loading && !error && certificates.length === 0 && (
            <div className="rounded-md border border-border bg-muted/20 py-8 text-center text-sm text-muted-foreground">
              <p>No certificates yet.</p>
              <p className="mt-1">
                Approved Land Parcel Certificate (LPC) requests will appear here. Track your requests under{" "}
                <Link href="/user/requests" className="text-primary underline-offset-4 hover:underline">
                  My Requests
                </Link>
                .
              </p>
            </div>
          )}
          {!loading && !error && certificates.length > 0 && (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <Table className="min-w-[320px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Certificate ID</TableHead>
                    <TableHead>Parcel</TableHead>
                    <TableHead className="w-[100px] sm:w-[120px]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {certificates.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-mono text-sm min-w-[140px]">
                        <span className="break-all">{c.certificateId ?? c.id}</span>
                      </TableCell>
                      <TableCell className="min-w-[100px]">
                        <span className="break-words">
                          {c.parcelNumber ?? c.parcelId}
                          {c.town ? ` · ${c.town}` : ""}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/user/certificates/${c.id}`}>
                            <FileText className="mr-1 h-4 w-4" />
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
