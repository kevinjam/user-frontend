"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  MapPin,
  FileText,
  Award,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/user/dashboard", icon: LayoutDashboard },
  { label: "Verify Land", href: "/user/verify-land", icon: MapPin },
  { label: "My Requests", href: "/user/requests", icon: FileText },
  { label: "Certificates", href: "/user/certificates", icon: Award },
  { label: "Profile", href: "/user/profile", icon: User },
] as const;

function SidebarContent({
  pathname,
  onNavigate,
}: {
  pathname: string;
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
          <MapPin className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="font-bold text-primary-foreground tracking-tight">UniBuild</span>
      </div>
      <div className="border-b border-primary/20 px-3 py-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-primary-foreground/80">
          Republic of South Sudan
        </p>
        <p className="text-xs text-primary-foreground/90">Citizen Land Portal</p>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 p-3">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
          <Link key={href} href={href} onClick={onNavigate}>
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
        ))}
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

export function UserDashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen min-w-0 bg-surface">
      {/* Desktop sidebar — green brand */}
      <aside className="sidebar-brand fixed left-0 top-0 z-40 hidden h-screen w-52 border-r border-primary/20 md:block lg:w-56">
        <SidebarContent pathname={pathname} />
      </aside>
      {/* Mobile sidebar overlay */}
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
        <SidebarContent pathname={pathname} onNavigate={() => setMobileOpen(false)} />
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
            Citizen Land Portal
          </h1>
        </header>
        <main className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
