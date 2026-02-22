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
import { FileUp } from "lucide-react";

export default function SubmitDocumentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Submit Documents</h2>
        <p className="text-sm text-muted-foreground">
          Upload supporting documents for your ECOSS registration (certificates, qualifications, ID). Required for verification.
        </p>
      </div>

      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileUp className="h-4 w-4 text-primary" />
            Document submission
          </CardTitle>
          <CardDescription>
            Complete your ECOSS application first, then upload any required supporting documents here. Accepted formats: PDF, JPG, PNG.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-dashed border-border bg-muted/20 py-12 text-center">
            <FileUp className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-sm font-medium text-foreground">Document upload</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Upload your supporting documents via your professional profile. Use the link below to add National ID, passport photo, certificates, and more.
            </p>
            <Button className="mt-4" variant="outline" asChild>
              <Link href="/professional/profile">
                Go to My Profile to upload documents
              </Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Not yet completed ECOSS registration?{" "}
            <Link href="/professional/register" className="text-primary hover:underline">
              Complete registration form
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
