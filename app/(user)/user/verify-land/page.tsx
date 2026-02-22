"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { FileSearch, Award, Upload, CreditCard } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { apiRequestForensicSearch, apiRequestLpc } from "@/lib/api";

type RequestType = "forensic" | "lpc";

const OPTIONS: { type: RequestType; label: string; description: string; price: string }[] = [
  {
    type: "forensic",
    label: "Forensic Search",
    description: "Verify land records and ownership. Results typically within 5–7 days.",
    price: "$5 – $10",
  },
  {
    type: "lpc",
    label: "Land Parcel Certificate (LPC)",
    description: "Official certificate for your parcel. Requires verified parcel details.",
    price: "$50 – $100",
  },
];

export default function VerifyLandPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [requestType, setRequestType] = useState<RequestType | null>(null);
  const [parcelId, setParcelId] = useState("");
  const [county, setCounty] = useState("");
  const [block, setBlock] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [paymentAck, setPaymentAck] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!token) {
      setError("You must be signed in to submit.");
      return;
    }
    if (!requestType || !parcelId.trim()) {
      setError("Please select a request type and enter the Parcel ID.");
      return;
    }
    if (!paymentAck) {
      setError("Please acknowledge the payment placeholder to continue.");
      return;
    }
    setIsSubmitting(true);
    try {
      if (requestType === "forensic") {
        await apiRequestForensicSearch(token, { parcelId: parcelId.trim() });
      } else {
        await apiRequestLpc(token, { parcelId: parcelId.trim() });
      }
      router.push("/user/requests?submitted=1");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground sm:text-xl">Verify Land</h2>
        <p className="mt-0.5 text-sm text-muted-foreground sm:mt-1">
          Request a forensic search or a Land Parcel Certificate (LPC). Select an option and complete the form.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        {/* Step 1: Request type */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-base sm:text-lg">1. Select service</CardTitle>
            <CardDescription className="text-sm">Choose the type of verification you need.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 px-4 sm:grid-cols-2 sm:px-6">
            {OPTIONS.map((opt) => (
              <button
                key={opt.type}
                type="button"
                onClick={() => setRequestType(opt.type)}
                className={`flex min-w-0 flex-col items-start rounded-lg border-2 p-4 text-left transition-colors ${
                  requestType === opt.type
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <span className="flex items-center gap-2 font-medium text-foreground">
                  {opt.type === "forensic" ? (
                    <FileSearch className="h-4 w-4 text-primary" />
                  ) : (
                    <Award className="h-4 w-4 text-primary" />
                  )}
                  {opt.label}
                </span>
                <span className="mt-1 text-sm text-muted-foreground">{opt.description}</span>
                <span className="mt-2 text-sm font-medium text-primary">{opt.price}</span>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Step 2: Form fields */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-base sm:text-lg">2. Parcel details</CardTitle>
            <CardDescription className="text-sm">
              Enter the parcel identifier from the land registry. County and block help us process your request.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-4 sm:px-6">
            <div className="space-y-2">
              <Label htmlFor="parcelId">Parcel ID or parcel number *</Label>
              <Input
                id="parcelId"
                value={parcelId}
                onChange={(e) => setParcelId(e.target.value)}
                placeholder="e.g. BLK-01-001 or registry ID"
                required
                className="w-full min-w-0 sm:max-w-md"
              />
              <p className="text-xs text-muted-foreground">
                Enter the parcel number from your land registry record, or the registry ID if you have it.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="county">County</Label>
                <Input
                  id="county"
                  value={county}
                  onChange={(e) => setCounty(e.target.value)}
                  placeholder="County"
                  className="w-full min-w-0 sm:max-w-xs"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="block">Block</Label>
                <Input
                  id="block"
                  value={block}
                  onChange={(e) => setBlock(e.target.value)}
                  placeholder="Block"
                  className="w-full min-w-0 sm:max-w-xs"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="document">Supporting document (optional)</Label>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Input
                  id="document"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="w-full min-w-0 cursor-pointer sm:max-w-md"
                />
                <Upload className="h-4 w-4 shrink-0 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">
                PDF or image. Upload will be enabled when payment is integrated.
              </p>
              {file && (
                <p className="text-xs text-muted-foreground">
                  Selected: {file.name} (not sent in this demo)
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Step 3: Payment placeholder */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <CreditCard className="h-4 w-4 text-primary" />
              3. Payment (placeholder)
            </CardTitle>
            <CardDescription>
              Payment integration will be added here. For now, acknowledge to submit your request. Fees: Forensic Search {OPTIONS[0].price}, LPC {OPTIONS[1].price}.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={paymentAck}
                onChange={(e) => setPaymentAck(e.target.checked)}
                className="mt-1 rounded border-input"
              />
              <span className="text-sm text-muted-foreground">
                I understand that payment will be required when the payment system is live. I confirm the service and fee range for my selection.
              </span>
            </label>
          </CardContent>
        </Card>

        {error && (
          <div className="rounded-md border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button type="submit" disabled={isSubmitting || !requestType || !parcelId.trim() || !paymentAck} className="w-full sm:w-auto">
            {isSubmitting ? "Submitting…" : "Submit request"}
          </Button>
          <Button type="button" variant="outline" asChild className="w-full sm:w-auto">
            <Link href="/user/dashboard">Cancel</Link>
          </Button>
        </div>
      </form>

      <footer className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-center text-xs text-muted-foreground sm:px-5">
        Information provided for guidance only. Refer to official Ministry records for legal finality.
      </footer>
    </div>
  );
}
