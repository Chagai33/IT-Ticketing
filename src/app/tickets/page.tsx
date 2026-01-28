import AppShell from "@/components/layout/AppShell";
import { TicketTable } from "@/features/tickets/components/TicketTable";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FirebaseTicketRepository } from "@/lib/infrastructure/firebase/FirebaseTicketRepository";
import Link from "next/link";

const ticketRepo = new FirebaseTicketRepository();

export default async function TicketsPage() {
  const tenantId = "demo";
  const tickets = await ticketRepo.findByTenant(tenantId);

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Tickets</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and track service requests.</p>
          </div>
          <Link href="/tickets/new">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
            >
              <Plus className="mr-2 h-4 w-4" /> Create Ticket
            </Button>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Filter tickets..."
              className="pl-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            />
          </div>
          <Button variant="outline" className="w-full md:w-auto border-slate-200 dark:border-slate-800">
            <Filter className="mr-2 h-4 w-4" /> Filters
          </Button>
        </div>

        <TicketTable data={JSON.parse(JSON.stringify(tickets))} />
      </div>
    </AppShell>
  );
}
