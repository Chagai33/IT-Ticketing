import AppShell from "@/components/layout/AppShell";
import { TicketInfoSuspense } from "@/features/tickets/components/TicketSuspense";
import { TicketTable } from "@/features/tickets/components/TicketTable";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FirebaseTicketRepository } from "@/lib/infrastructure/firebase/FirebaseTicketRepository";

const ticketRepo = new FirebaseTicketRepository();

export default async function DashboardPage() {
  const tenantId = "demo";
  const tickets = await ticketRepo.findByTenant(tenantId);
  const criticalTickets = tickets.filter(t => t.priority === "CRITICAL" && t.status !== "CLOSED").length;
  const resolvedToday = tickets.filter(t => t.status === "RESOLVED").length; // Basic count

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
            <p className="text-slate-500">Overview of your ticketing system</p>
          </div>
          <Link href="/tickets/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Ticket
            </Button>
          </Link>
        </div>

        {/* Bento Grid Stats */}
        <div className="grid gap-4 md:grid-cols-4 md:grid-rows-2">
          <div className="col-span-2 row-span-2 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between group hover:border-blue-500 transition-all">
            <div>
              <div className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">Total Active Tickets</div>
              <div className="text-5xl font-black text-slate-900 dark:text-white">{tickets.length}</div>
            </div>
            <div className="mt-8">
              <div className="flex justify-between text-xs text-slate-500 mb-2">
                <span>Capacity</span>
                <span>{Math.min(100, (tickets.length / 50) * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (tickets.length / 50) * 100)}%` }} />
              </div>
            </div>
          </div>

          <div className="p-6 bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-100 dark:border-amber-900 shadow-sm hover:scale-[1.02] transition-transform">
            <div className="text-sm font-medium text-amber-700 dark:text-amber-400">Critical Issues</div>
            <div className="text-3xl font-bold text-amber-900 dark:text-amber-200 mt-2">{criticalTickets}</div>
          </div>

          <div className="p-6 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900 shadow-sm hover:scale-[1.02] transition-transform">
            <div className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Resolved Today</div>
            <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-200 mt-2">{resolvedToday}</div>
          </div>

          <div className="col-span-2 p-6 bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center justify-between overflow-hidden relative group">
            <div className="relative z-10">
              <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">System Health</div>
              <div className="text-2xl font-bold">99.9%</div>
            </div>
            <div className="flex h-12 gap-1 items-end relative z-10">
              {[4, 7, 3, 9, 5, 8, 4, 6].map((h, i) => (
                <div key={i} className="w-1.5 bg-blue-500/50 rounded-t-sm animate-pulse" style={{ height: `${h * 10}%`, animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Recent Tickets Full-Width */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">In Queue</h2>
            <Link href="/tickets">
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 font-semibold">
                View All Queue →
              </Button>
            </Link>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
            <TicketInfoSuspense>
              <TicketTable data={JSON.parse(JSON.stringify(tickets.slice(0, 5)))} />
            </TicketInfoSuspense>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
