"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, BadgeCheck, CreditCard } from "lucide-react";

const ANNUAL_FEE = 30;

// TODO: replace with API (e.g. GET /api/professional-profile/me includes paymentStatus, membershipExpiry)
const MOCK_PAYMENT_PAID = false;
const MOCK_EXPIRY_DATE: string | null = null;

export default function MembershipStatusPage() {
  const paymentPaid = MOCK_PAYMENT_PAID;
  const expiryDate = MOCK_EXPIRY_DATE;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Membership Status</h2>
        <p className="text-sm text-muted-foreground">
          Annual membership fee and payment status. Design upload is enabled when membership is paid.
        </p>
      </div>

      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BadgeCheck className="h-4 w-4 text-primary" />
            Membership overview
          </CardTitle>
          <CardDescription>
            Republic of South Sudan · Engineering Council of South Sudan (ECOSS)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Annual fee</span>
            <span className="font-semibold">${ANNUAL_FEE}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Payment status</span>
            <Badge variant={paymentPaid ? "default" : "destructive"}>
              {paymentPaid ? "Paid" : "Unpaid"}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Expiry date</span>
            <span className="font-medium">
              {expiryDate
                ? new Date(expiryDate).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "—"}
            </span>
          </div>
          {!paymentPaid && (
            <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
              Pay the annual fee to enable design upload and permit requests.
            </div>
          )}
          <Button variant="outline" size="sm" disabled>
            Renew / Pay ${ANNUAL_FEE} (placeholder)
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border bg-muted/20">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            Ensure your{" "}
            <Link href="/professional/register" className="text-primary underline-offset-4 hover:underline">
              ECOSS registration
            </Link>{" "}
            is complete and approved to maintain active membership.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
