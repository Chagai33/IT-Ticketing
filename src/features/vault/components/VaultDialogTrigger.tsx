"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { VaultDialog } from "./VaultDialog";

export function VaultDialogTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        className="bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 shadow-xl"
        onClick={() => setOpen(true)}
      >
        <Plus className="mr-2 h-4 w-4" /> New Secret
      </Button>
      <VaultDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
