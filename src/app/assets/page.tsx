import AppShell from "@/components/layout/AppShell";
import { AssetTable } from "@/features/assets/components/AssetTable";
import { AssetDialogTrigger } from "@/features/assets/components/AssetDialogTrigger";
import { Button } from "@/components/ui/button";
import { Search, Filter, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FirebaseAssetRepository } from "@/lib/infrastructure/firebase/FirebaseAssetRepository";

const assetRepo = new FirebaseAssetRepository();

export default async function AssetsPage() {
  const tenantId = "demo";
  const assets = await assetRepo.findAll(tenantId);

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Assets</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and track company hardware and infrastructure.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="hidden lg:flex border-slate-200 dark:border-slate-800">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
            <AssetDialogTrigger />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by name, serial, or asset tag..."
              className="pl-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            />
          </div>
          <Button variant="outline" className="w-full md:w-auto border-slate-200 dark:border-slate-800">
            <Filter className="mr-2 h-4 w-4" /> Filters
          </Button>
        </div>

        <AssetTable assets={JSON.parse(JSON.stringify(assets))} />
      </div>
    </AppShell>
  );
}
