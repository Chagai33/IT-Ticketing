"use client";

import { Asset } from "@/lib/domain/entities";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Laptop,
  Monitor,
  Smartphone,
  Printer,
  Network,
  MoreHorizontal,
  ArrowUpDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const typeIcons: Record<string, any> = {
  LAPTOP: Laptop,
  DESKTOP: Monitor,
  MOBILE: Smartphone,
  PRINTER: Printer,
  NETWORK: Network,
  OTHER: MoreHorizontal,
};

const statusColors: Record<string, string> = {
  AVAILABLE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
  ASSIGNED: "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
  IN_REPAIR: "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
  RETIRED: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
  LOST: "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400",
};

interface AssetTableProps {
  assets: Asset[];
}

export function AssetTable({ assets }: AssetTableProps) {
  return (
    <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[80px]">Type</TableHead>
            <TableHead>Asset Name</TableHead>
            <TableHead>Tag</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                No assets found.
              </TableCell>
            </TableRow>
          ) : (
            assets.map((asset) => {
              const Icon = typeIcons[asset.type] || MoreHorizontal;
              return (
                <TableRow key={asset.id} className="cursor-pointer group">
                  <TableCell>
                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                      <Icon className="w-5 h-5" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-slate-900 dark:text-white">{asset.name}</div>
                    <div className="text-xs text-slate-500">{asset.serialNumber}</div>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-mono">
                      {asset.assetTag}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("border-none", statusColors[asset.status])}>
                      {asset.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400">
                    {asset.location || "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(asset.assetTag)}>
                          Copy Asset Tag
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Assign User</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Mark as Lost</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// Helper function locally if not imported
function cn(...classes: (string | undefined | null | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}
