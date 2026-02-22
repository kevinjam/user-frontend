import { UserDashboardShell } from "@/components/layout/user-dashboard-shell";
import { AuthGuard } from "@/components/auth-guard";
import { PATH_ROLE_MAP } from "@/lib/route-protection";
import { UserDashboardSkeleton } from "@/components/dashboard-skeletons";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard
      allowedRoles={PATH_ROLE_MAP["/user"] as ("CITIZEN" | "ARCHITECT" | "ENGINEER")[]}
      loadingPlaceholder={
        <UserDashboardShell>
          <UserDashboardSkeleton />
        </UserDashboardShell>
      }
    >
      <UserDashboardShell>{children}</UserDashboardShell>
    </AuthGuard>
  );
}
