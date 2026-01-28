"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Ticket } from "@/lib/domain/entities";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge"; // Ensure Badge exists
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export const columns: ColumnDef<Ticket>[] = [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variant =
        status === "OPEN" ? "default" :
          status === "RESOLVED" ? "success" :
            status === "WAITING_USER" ? "warning" : "secondary";

      return <Badge variant={variant as any}>{status.replace("_", " ")}</Badge>;
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <span className="font-medium">{row.getValue("title")}</span>,
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;
      return (
        <span className={
          priority === "CRITICAL" ? "text-red-600 font-bold" :
            priority === "HIGH" ? "text-orange-600" :
              "text-slate-600"
        }>
          {priority}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = row.getValue("createdAt");
      // Handle both Firestore Timestamp and Date objects
      const d = (date as any)?.toDate ? (date as any).toDate() : new Date(date as any);
      return format(d, "MMM d, HH:mm");
    },
  },
];

interface TicketTableProps {
  data: Ticket[];
}

export function TicketTable({ data }: TicketTableProps) {
  const router = useRouter();

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="title"
      onRowClick={(ticket) => router.push(`/tickets/${ticket.id}`)}
    />
  );
}
