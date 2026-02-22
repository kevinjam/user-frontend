"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, User, Briefcase, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export type DashboardRole = "user" | "professional";

const roleConfig: Record<
  DashboardRole,
  { label: string; basePath: string; icon: React.ElementType }
> = {
  user: { label: "Citizen User", basePath: "/user/dashboard", icon: User },
  professional: {
    label: "Professional",
    basePath: "/professional/dashboard",
    icon: Briefcase,
  },
};

interface DashboardShellProps {
  role: DashboardRole;
  children: React.ReactNode;
}

export function DashboardShell({ role, children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const config = roleConfig[role];
  const Icon = config.icon;

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="fixed left-0 top-0 z-40 h-screen w-56 border-r border-border bg-card shadow-sm">
        <div className="flex h-14 items-center gap-2 border-b border-border px-4">
          <Icon className="h-6 w-6 text-primary" />
          <span className="font-semibold text-foreground">UniBuild</span>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          <Link href={config.basePath}>
            <Button
              variant={pathname === config.basePath ? "secondary" : "ghost"}
              className="w-full justify-start"
              size="sm"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-border p-3">
          <p className="text-xs text-muted-foreground">{config.label}</p>
        </div>
      </aside>
      <div className="flex flex-1 flex-col pl-56">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-border bg-card px-6 shadow-sm">
          <h1 className="text-sm font-medium text-foreground">
            {config.label} Portal
          </h1>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
