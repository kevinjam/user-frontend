"use client";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function UserDashboardSkeleton() {
  return (
    <div className="space-y-6 p-4 sm:p-6 md:space-y-8">
      <div className="rounded-lg border border-border bg-card px-4 py-3 shadow-sm">
        <Skeleton className="h-3 w-48" />
        <Skeleton className="mt-2 h-5 w-56" />
        <Skeleton className="mt-1 h-4 w-72 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-border bg-card shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-12" />
              <Skeleton className="mt-1 h-3 w-36" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <Skeleton className="h-5 w-56" />
          <Skeleton className="h-4 w-full max-w-md" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-32" />
        </CardContent>
      </Card>
      <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-2 h-4 w-full max-w-xl" />
      </div>
    </div>
  );
}

export function ProfessionalDashboardSkeleton() {
  return (
    <div className="space-y-6 p-4 sm:p-6 md:space-y-8">
      <div className="rounded-lg border border-border bg-card px-4 py-3 shadow-sm">
        <Skeleton className="h-3 w-52" />
        <Skeleton className="mt-2 h-5 w-40" />
        <Skeleton className="mt-1 h-4 w-80 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-border bg-card shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 w-20" />
              <Skeleton className="mt-1 h-3 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-full max-w-lg" />
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-9 w-36" />
          <Skeleton className="h-9 w-32" />
        </CardContent>
      </Card>
      <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-2 h-4 w-full max-w-xl" />
      </div>
    </div>
  );
}
