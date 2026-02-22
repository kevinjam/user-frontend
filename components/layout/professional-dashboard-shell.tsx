"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  User,
  FileUp,
  PenTool,
  FileCheck,
  BadgeCheck,
  LogOut,
  Briefcase,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { apiProfessionalProfileGetMe } from "@/lib/api";
import { cn } from "@/lib/utils";

const NAV_ITEMS: { label: string; href: string; icon: typeof LayoutDashboard; requireApproved?: boolean }[] = [
  { label: "Dashboard", href: "/professional/dashboard", icon: LayoutDashboard },
  { label: "My Profile", href: "/professional/profile", icon: User },
  { label: "Submit Documents", href: "/professional/documents", icon: FileUp },
  { label: "Upload Design", href: "/professional/design", icon: PenTool, requireApproved: true },
  { label: "Permit Requests", href: "/professional/permits", icon: FileCheck },
  { label: "Membership Status", href: "/professional/membership", icon: BadgeCheck },
];

function SidebarContent({
  pathname,
  verificationApproved,
  onNavigate,
}: {
  pathname: string;
  verificationApproved: boolean | null;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    router.replace("/login");
  };
  return (
    <>
      <div className="flex h-14 items-center gap-2 border-b border-primary/20 px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/15">
          <Briefcase className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="font-bold text-primary-foreground tracking-tight">UniBuild</span>
      </div>
      <div className="border-b border-primary/20 px-3 py-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-primary-foreground/80">
          Professional Portal
        </p>
        <p className="text-xs text-primary-foreground/90">Engineer / Architect</p>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 p-3">
        {NAV_ITEMS.map(({ label, href, icon: Icon, requireApproved }) => {
          const disabled = requireApproved === true && verificationApproved !== true;
          return (
            <Link
              key={href}
              href={href}
              className={cn(disabled && "opacity-60 cursor-not-allowed")}
              title={disabled ? "Requires approved professional verification" : undefined}
              onClick={onNavigate}
            >
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-start text-primary-foreground/95 hover:bg-primary-foreground/15 hover:text-primary-foreground",
                  pathname === href && "bg-primary-foreground/20 text-primary-foreground font-medium"
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                {label}
              </Button>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-primary/20 p-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-primary-foreground/90 hover:bg-primary-foreground/15 hover:text-primary-foreground"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </>
  );
}

export function ProfessionalDashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { token } = useAuth();
  const [verificationApproved, setVerificationApproved] = useState<boolean | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!token) {
      setVerificationApproved(false);
      return;
    }
    apiProfessionalProfileGetMe(token)
      .then((res) => setVerificationApproved(res.data?.status === "approved"))
      .catch(() => setVerificationApproved(false));
  }, [token]);

  return (
    <div className="flex min-h-screen min-w-0 bg-surface">
      <aside className="sidebar-brand fixed left-0 top-0 z-40 hidden h-screen w-52 border-r border-primary/20 md:block lg:w-56">
        <SidebarContent pathname={pathname} verificationApproved={verificationApproved} />
      </aside>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 md:hidden"
          aria-hidden
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={cn(
          "sidebar-brand fixed left-0 top-0 z-50 flex h-screen w-56 flex-col border-r border-primary/20 shadow-xl transition-transform duration-200 ease-out md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-primary/20 px-4">
          <span className="font-semibold text-primary-foreground">Menu</span>
          <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80" onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <SidebarContent
          pathname={pathname}
          verificationApproved={verificationApproved}
          onNavigate={() => setMobileOpen(false)}
        />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col md:pl-52 lg:pl-56">
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-4 border-b border-border bg-surface-elevated px-3 shadow-sm backdrop-blur sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-foreground"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-sm font-semibold text-brand-green truncate">
            Professional Portal
          </h1>
        </header>
        <main className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
