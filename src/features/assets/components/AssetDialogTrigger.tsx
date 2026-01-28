"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AssetDialog } from "./AssetDialog";

export function AssetDialogTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
        onClick={() => setOpen(true)}
      >
        <Plus className="mr-2 h-4 w-4" /> Add Asset
      </Button>
      <AssetDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
