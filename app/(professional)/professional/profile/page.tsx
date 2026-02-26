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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/auth-context";
import {
  apiProfessionalProfileGetMe,
  apiProfessionalProfileSubmit,
  apiUpload,
  type ProfessionalProfileData,
} from "@/lib/api";
import { Upload, ExternalLink, CheckCircle2 } from "lucide-react";

function isValidDocumentUrl(url: string | undefined): boolean {
  if (!url || typeof url !== "string") return false;
  const t = url.trim();
  return t.length > 0 && (t.startsWith("http://") || t.startsWith("https://"));
}

const UPLOAD_LABELS: { key: keyof typeof documentKeys; label: string }[] = [
  { key: "nationalId", label: "National ID" },
  { key: "passportPhoto", label: "Passport Photo" },
  { key: "degreeCertificate", label: "Degree Certificate" },
  { key: "experienceProof", label: "Experience Proof" },
  { key: "membershipCertificate", label: "Membership Certificate" },
];

const documentKeys = {
  nationalId: "",
  passportPhoto: "",
  degreeCertificate: "",
  experienceProof: "",
  membershipCertificate: "",
};

const initialFiles: Record<string, File | null> = Object.fromEntries(
  Object.keys(documentKeys).map((k) => [k, null])
) as Record<string, File | null>;

export default function ProfessionalProfilePage() {
  const { token } = useAuth();
  const [profile, setProfile] = useState<ProfessionalProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [professionType, setProfessionType] = useState<"Engineer" | "Architect">("Engineer");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [files, setFiles] = useState<Record<string, File | null>>(initialFiles);
  /** Document key -> uploaded URL (from profile or from new uploads this session). */
  const [documentUrls, setDocumentUrls] = useState<Record<string, string>>({});
  const [documentsInitialized, setDocumentsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    apiProfessionalProfileGetMe(token)
      .then((res) => {
        if (res.success && res.data) {
          const p = res.data;
          setProfile(p);
          setProfessionType((p.professionType as "Engineer" | "Architect") ?? "Engineer");
          setYearsOfExperience(String(p.yearsOfExperience ?? ""));
          setLicenseNumber(p.licenseNumber ?? "");
          if (!documentsInitialized && p.documents && typeof p.documents === "object") {
            const valid: Record<string, string> = {};
            (Object.entries(p.documents) as [keyof typeof documentKeys, string][]).forEach(([k, v]) => {
              if (isValidDocumentUrl(v)) valid[k] = v;
            });
            if (Object.keys(valid).length > 0) setDocumentUrls(valid);
            setDocumentsInitialized(true);
          }
        }
      })
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [token, documentsInitialized]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const years = parseInt(yearsOfExperience, 10);
    if (isNaN(years) || years < 2) {
      setError("Years of experience must be at least 2.");
      return;
    }
    if (!licenseNumber.trim()) {
      setError("License number is required.");
      return;
    }
    if (!token) {
      setError("You must be signed in to submit.");
      return;
    }
    setIsSubmitting(true);
    try {
      const documents: Record<string, string> = { ...documentUrls };
      const keys = Object.keys(documentKeys) as (keyof typeof documentKeys)[];
      for (const key of keys) {
        const file = files[key];
        if (file) {
          const uploadRes = await apiUpload(token, file);
          if (uploadRes.success && uploadRes.url) documents[key] = uploadRes.url;
        }
      }
      const res = await apiProfessionalProfileSubmit(token, {
        professionType,
        yearsOfExperience: years,
        licenseNumber: licenseNumber.trim(),
        documents: Object.keys(documents).length ? documents : undefined,
      });
      setProfile(res.data);
      const nextUrls: Record<string, string> = {};
      if (res.data.documents && typeof res.data.documents === "object") {
        (Object.entries(res.data.documents) as [keyof typeof documentKeys, string][]).forEach(([k, v]) => {
          if (isValidDocumentUrl(v)) nextUrls[k] = v;
        });
      }
      setDocumentUrls(nextUrls);
      setFiles(initialFiles);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">My Profile</h2>
        <p className="text-sm text-muted-foreground">
          Submit your professional profile (Engineer / Architect). Minimum 2 years of experience required.
        </p>
      </div>

      {profile && (
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Profile status</CardTitle>
            <CardDescription>
              Your submission is under review.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Status</span>
              <StatusBadge
                status={profile.status}
                label={
                  profile.status === "pending_review"
                    ? "Pending Approval"
                    : profile.status === "approved"
                      ? "Approved"
                      : "Rejected"
                }
              />
            </div>
            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">Profession</dt>
                <dd className="font-medium">{profile.professionType}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Years of experience</dt>
                <dd className="font-medium">{profile.yearsOfExperience}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">License number</dt>
                <dd className="font-medium">{profile.licenseNumber}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      )}

      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">
            {profile ? "Update profile" : "Professional profile submission"}
          </CardTitle>
          <CardDescription>
            Profession type, experience, license number, and document uploads. Years of experience must be at least 2.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Profession type</Label>
                <Select
                  value={professionType}
                  onValueChange={(v) => setProfessionType(v as "Engineer" | "Architect")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineer">Engineer</SelectItem>
                    <SelectItem value="Architect">Architect</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="years">Years of experience *</Label>
                <Input
                  id="years"
                  type="number"
                  min={2}
                  value={yearsOfExperience}
                  onChange={(e) => setYearsOfExperience(e.target.value)}
                  placeholder="e.g. 5"
                  required
                />
                <p className="text-xs text-muted-foreground">Minimum 2 years required.</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="license">License number *</Label>
              <Input
                id="license"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                placeholder="License or registration number"
                required
              />
            </div>

            <div>
              <Label className="mb-3 block">Upload documents</Label>
              <p className="mb-3 text-xs text-muted-foreground">
                Images (JPEG, PNG, GIF, WebP) or PDF. Files are uploaded to the server; you can replace any document by choosing a new file.
              </p>
              <div className="space-y-3">
                {UPLOAD_LABELS.map(({ key, label }) => {
                  const hasUrl = isValidDocumentUrl(documentUrls[key]);
                  const hasNewFile = !!files[key];
                  return (
                    <div key={key} className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-muted/20 p-3">
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,image/*,application/pdf"
                        onChange={(e) =>
                          setFiles((prev) => ({ ...prev, [key]: e.target.files?.[0] ?? null }))
                        }
                        className="max-w-xs cursor-pointer"
                      />
                      <span className="text-sm font-medium text-foreground">{label}</span>
                      {hasUrl && (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          <span className="text-xs text-muted-foreground">Uploaded</span>
                          <a
                            href={documentUrls[key]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            View <ExternalLink className="h-3 w-3" />
                          </a>
                        </>
                      )}
                      {hasNewFile && !hasUrl && (
                        <span className="text-xs text-muted-foreground">(New: {files[key]?.name})</span>
                      )}
                      {!hasUrl && !hasNewFile && (
                        <Upload className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {error && (
              <div className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting…" : profile ? "Update profile" : "Submit profile"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="max-w-xl border-border bg-muted/20">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            ECOSS registration (qualifications, category) is separate. Complete the{" "}
            <Link href="/professional/register" className="text-primary underline-offset-4 hover:underline">
              ECOSS registration form
            </Link>{" "}
            for official council registration.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
