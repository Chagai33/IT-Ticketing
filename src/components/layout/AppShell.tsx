"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Ticket, Monitor, Users, Settings, LogOut, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CommandPalette } from "./CommandPalette";
import { useAuth } from "@/components/providers/AuthProvider";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col">
        <div className="p-6 h-16 flex items-center border-b border-slate-100 dark:border-slate-800">
          <div className="font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              T
            </div>
            Ticketing
          </div>
        </div>

        <div className="px-4 mb-4">
          <CommandPalette />
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto mt-0 pt-0">
          <NavItem href="/dashboard" icon={LayoutDashboard}>Dashboard</NavItem>
          <NavItem href="/tickets" icon={Ticket}>Tickets</NavItem>
          <NavItem href="/assets" icon={Monitor}>Assets</NavItem>
          <NavItem href="/vault" icon={ShieldCheck}>Security Vault</NavItem>
          <NavItem href="/users" icon={Users}>Users</NavItem>
          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
            <NavItem href="/settings" icon={Settings}>Settings</NavItem>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => logout()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header (placeholder for now) */}
        <header className="md:hidden h-16 bg-white border-b flex items-center px-4">
          <span className="font-bold">Ticketing System</span>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ href, icon: Icon, children }: { href: string; icon: any; children: ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
        isActive
          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
          : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
      )}
    >
      <Icon className={cn("w-4 h-4", isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400")} />
      {children}
    </Link>
  );
}
