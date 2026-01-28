"use client";

import AppShell from "@/components/layout/AppShell";
import { TicketWizard } from "@/features/tickets/components/TicketWizard";

export default function NewTicketPage() {
  return (
    <AppShell>
      <div className="py-6">
        <TicketWizard />
      </div>
    </AppShell>
  );
}
