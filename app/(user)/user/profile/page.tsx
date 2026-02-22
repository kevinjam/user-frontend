"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground sm:text-xl">Profile</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Your account details. Contact support to update personal information.
        </p>
      </div>

      <Card className="border-border bg-card shadow-sm w-full min-w-0 max-w-xl">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-base sm:text-lg">Account</CardTitle>
          <CardDescription>
            Citizen Land Portal · Republic of South Sudan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-4 sm:px-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Name
            </p>
            <p className="mt-0.5 text-foreground">{user?.name ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Email
            </p>
            <p className="mt-0.5 text-foreground">{user?.email ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Role
            </p>
            <div className="mt-1 flex flex-wrap gap-1">
              {user?.roles?.map((r) => (
                <Badge key={r} variant="secondary">{r}</Badge>
              )) ?? "—"}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
