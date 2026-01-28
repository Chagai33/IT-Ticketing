import AppShell from "@/components/layout/AppShell";
import { VaultRow } from "@/features/vault/components/VaultRow";
import { Button } from "@/components/ui/button";
import { Plus, ShieldAlert, Lock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { VaultDialogTrigger } from "@/features/vault/components/VaultDialogTrigger";
import { FirebaseVaultRepository } from "@/lib/infrastructure/firebase/FirebaseVaultRepository";

const vaultRepo = new FirebaseVaultRepository();

export default async function VaultPage() {
  const tenantId = "demo";
  const secrets = await vaultRepo.findByTenant(tenantId);

  return (
    <AppShell>
      <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-20 px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-white shadow-2xl">
              <Lock className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Security Vault</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">End-to-end encrypted storage for team credentials.</p>
            </div>
          </div>
          <VaultDialogTrigger />
        </div>

        <div className="bg-blue-600/5 border border-blue-100 dark:border-blue-900/50 p-4 rounded-xl flex gap-3 shadow-sm">
          <ShieldAlert className="h-5 w-5 text-blue-600 shrink-0" />
          <div className="text-xs text-blue-800 dark:text-blue-300 font-medium leading-relaxed">
            <span className="font-bold">Zero-Knowledge Disclosure:</span> All data is encrypted with AES-256-GCM using your private server key.
            Values stay in our secure vault until explicitly revealed. Access is audited per event.
          </div>
        </div>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
          <Input
            placeholder="Search secrets by title or notes..."
            className="pl-10 bg-white/50 backdrop-blur-sm dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl"
          />
        </div>

        <div className="grid gap-3">
          {secrets.length === 0 ? (
            <div className="text-center py-20 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm font-medium">
              No secrets stored in vault yet.
            </div>
          ) : (
            secrets.map(secret => (
              <VaultRow
                key={secret.id}
                item={JSON.parse(JSON.stringify(secret))}
              />
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}
