"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { UserDialog } from "./UserDialog";

export function UserDialogTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        className="bg-blue-600 hover:bg-blue-700"
        onClick={() => setOpen(true)}
      >
        <UserPlus className="mr-2 h-4 w-4" /> Invite User
      </Button>
      <UserDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
