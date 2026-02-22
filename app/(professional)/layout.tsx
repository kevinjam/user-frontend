import { ProfessionalDashboardShell } from "@/components/layout/professional-dashboard-shell";
import { AuthGuard } from "@/components/auth-guard";
import { PATH_ROLE_MAP } from "@/lib/route-protection";
import { ProfessionalDashboardSkeleton } from "@/components/dashboard-skeletons";

export default function ProfessionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard
      allowedRoles={PATH_ROLE_MAP["/professional"] as ("CITIZEN" | "ARCHITECT" | "ENGINEER")[]}
      loadingPlaceholder={
        <ProfessionalDashboardShell>
          <ProfessionalDashboardSkeleton />
        </ProfessionalDashboardShell>
      }
    >
      <ProfessionalDashboardShell>{children}</ProfessionalDashboardShell>
    </AuthGuard>
  );
}
