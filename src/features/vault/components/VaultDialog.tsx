"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { toast } from "sonner";
import { createSecretAction } from "@/app/vault/actions";

interface VaultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function VaultDialog({ open, onOpenChange, onSuccess }: VaultDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "PASSWORD",
    value: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await createSecretAction({
        tenantId: "demo",
        title: formData.title,
        category: formData.category,
        value: formData.value,
        notes: formData.notes
      });

      if (result.success) {
        toast.success("Secret stored in vault");
        onOpenChange(false);
        onSuccess?.();
        setFormData({ title: "", category: "PASSWORD", value: "", notes: "" });
      } else {
        toast.error(result.error || "Failed to store secret");
      }
    } catch (error) {
      toast.error("Failed to store secret");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Store New Secret</DialogTitle>
            <DialogDescription>
              Data is encrypted with AES-256 before being saved.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title / Name</Label>
              <Input
                id="title"
                placeholder="e.g. Production DB Root"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(v) => setFormData({ ...formData, category: v })}
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PASSWORD">Password</SelectItem>
                  <SelectItem value="SSH_KEY">SSH Key</SelectItem>
                  <SelectItem value="API_TOKEN">API Token</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="value">Value (to be encrypted)</Label>
              <Input
                id="value"
                type="password"
                placeholder="••••••••••••"
                value={formData.value}
                onChange={e => setFormData({ ...formData, value: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any additional context..."
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-slate-900 dark:bg-white dark:text-slate-900 border-none shadow-lg">
              {loading ? "Encrypting..." : "Store Secret"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
