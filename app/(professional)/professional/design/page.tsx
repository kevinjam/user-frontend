"use client";

import { useState, useEffect } from "react";
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
import { PenTool, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import {
  apiDesignSubmissionSubmit,
  apiProfessionalProfileGetMe,
  type DesignSubmissionData,
} from "@/lib/api";
import { StatusBadge } from "@/components/ui/status-badge";

// TODO: replace with API (e.g. membership payment status from GET /api/professional-profile/me or dedicated membership API)
const MOCK_PAYMENT_PAID = false;

const CODE_CHECK_FEE_MIN = 25;
const CODE_CHECK_FEE_MAX = 50;

export default function UploadDesignPage() {
  const { token } = useAuth();
  const paymentPaid = MOCK_PAYMENT_PAID;

  const [verificationApproved, setVerificationApproved] = useState<boolean | null>(null);
  useEffect(() => {
    if (!token) {
      setVerificationApproved(false);
      return;
    }
    apiProfessionalProfileGetMe(token)
      .then((res) => setVerificationApproved(res.data?.status === "approved"))
      .catch(() => setVerificationApproved(false));
  }, [token]);

  const pageEnabled = verificationApproved === true && paymentPaid;

  const [projectName, setProjectName] = useState("");
  const [location, setLocation] = useState("");
  const [projectValue, setProjectValue] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmission, setLastSubmission] = useState<DesignSubmissionData | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFile(f ?? null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!token) {
      setError("You must be signed in to submit.");
      return;
    }
    if (verificationApproved !== true) {
      setError("Professional verification must be approved before submitting designs.");
      return;
    }
    if (!paymentPaid) {
      setError("Membership payment is required before submitting designs.");
      return;
    }
    const valueNum = parseFloat(projectValue.replace(/,/g, ""));
    if (!projectName.trim()) {
      setError("Project name is required.");
      return;
    }
    if (!location.trim()) {
      setError("Location is required.");
      return;
    }
    if (isNaN(valueNum) || valueNum < 0) {
      setError("Please enter a valid project value (number ≥ 0).");
      return;
    }
    if (!file) {
      setError("Please select a drawing file to upload.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiDesignSubmissionSubmit(token, {
        projectName: projectName.trim(),
        location: location.trim(),
        projectValue: valueNum,
        drawingFileRef: file.name,
      });
      if (res.success && res.data) {
        setLastSubmission(res.data);
        setProjectName("");
        setLocation("");
        setProjectValue("");
        setFile(null);
        const input = document.getElementById("drawing-file") as HTMLInputElement;
        if (input) input.value = "";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Upload Design</h2>
        <p className="text-sm text-muted-foreground">
          Submit architectural or engineering designs. Include project details and a drawing file. A code check fee applies.
        </p>
      </div>

      {verificationApproved === false && (
        <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <div>
            <p className="font-medium">Professional verification required</p>
            <p className="mt-0.5 text-sm">
              Upload Design is disabled until your professional profile is approved. Complete{" "}
              <Link href="/professional/profile" className="underline underline-offset-2 font-medium">
                My Profile
              </Link>{" "}
              and wait for verification approval.
            </p>
          </div>
        </div>
      )}

      {verificationApproved === true && !paymentPaid && (
        <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <div>
            <p className="font-medium">Membership payment required</p>
            <p className="mt-0.5 text-sm">
              Design upload is disabled until your annual membership fee is paid. Please go to{" "}
              <Link href="/professional/membership" className="underline underline-offset-2 font-medium">
                Membership Status
              </Link>{" "}
              to pay the $30 annual fee.
            </p>
          </div>
        </div>
      )}

      {lastSubmission && (
        <Card className="border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Submission received</CardTitle>
            <CardDescription>
              Your design has been submitted. Compliance status:
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2">
              <StatusBadge status={lastSubmission.complianceStatus} />
              <span className="text-sm text-muted-foreground">
                Project: {lastSubmission.projectName}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <PenTool className="h-4 w-4 text-primary" />
            Design upload
          </CardTitle>
          <CardDescription>
            Enter project details and upload your drawing file. Code check fee applies per submission.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-1">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  placeholder="e.g. Residential Block A"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  disabled={!pageEnabled}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g. Juba, Munuki"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={!pageEnabled}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-value">Project Value</Label>
                <Input
                  id="project-value"
                  type="text"
                  inputMode="decimal"
                  placeholder="e.g. 50000"
                  value={projectValue}
                  onChange={(e) => setProjectValue(e.target.value)}
                  disabled={!pageEnabled}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="drawing-file">Upload Drawing File</Label>
                <Input
                  id="drawing-file"
                  type="file"
                  accept=".pdf,.dwg,.dxf,image/*"
                  onChange={handleFileChange}
                  disabled={!pageEnabled}
                  className="cursor-pointer file:mr-2 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-primary-foreground"
                />
                {file && (
                  <p className="text-xs text-muted-foreground">Selected: {file.name}</p>
                )}
              </div>
            </div>

            <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm">
              <span className="font-medium text-foreground">Code Check Fee:</span>{" "}
              <span className="text-muted-foreground">
                ${CODE_CHECK_FEE_MIN}–${CODE_CHECK_FEE_MAX}
              </span>
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button type="submit" disabled={!pageEnabled || isSubmitting}>
              {isSubmitting ? "Submitting…" : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
