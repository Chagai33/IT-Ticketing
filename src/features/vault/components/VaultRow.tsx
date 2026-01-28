"use client";

import { useState } from "react";
import { VaultItem } from "@/lib/domain/entities";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Trash2, Key, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { revealSecretAction, deleteSecretAction } from "@/app/vault/actions";
import { toast } from "sonner";

interface VaultRowProps {
  item: VaultItem;
}

export function VaultRow({ item }: VaultRowProps) {
  const [revealedValue, setRevealedValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleToggleReveal = async () => {
    if (revealedValue) {
      setRevealedValue(null);
      return;
    }

    setLoading(true);
    try {
      const result = await revealSecretAction(item.tenantId, item.id);
      if (result.success) {
        setRevealedValue(result.value || "");
      } else {
        toast.error("Failed to decrypt secret");
      }
    } catch (error) {
      toast.error("Error revealing secret");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this secret forever?")) return;

    try {
      const result = await deleteSecretAction(item.tenantId, item.id);
      if (result.success) {
        toast.success("Secret deleted");
      }
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center gap-4 group hover:shadow-md transition-shadow">
      <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
        <Key className="h-5 w-5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-bold text-slate-900 dark:text-white truncate">{item.title}</h4>
          <Badge variant="outline" className="text-[10px] uppercase font-bold text-slate-400 border-slate-200">
            {item.category}
          </Badge>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" /> {item.updatedBy}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> {format(new Date(item.updatedAt), "MMM d, yyyy")}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 items-center">
          <div className="px-3 min-w-[120px] text-sm font-mono truncate max-w-[200px]">
            {revealedValue ? revealedValue : "••••••••••••"}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={handleToggleReveal}
            disabled={loading}
          >
            {revealedValue ? <EyeOff className="h-4 w-4 text-slate-400" /> : <Eye className="h-4 w-4 text-blue-500" />}
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-400 hover:text-red-600"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
