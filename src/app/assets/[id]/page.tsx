"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Edit,
  QrCode,
  History,
  ShieldCheck,
  UserPlus,
  Clock,
  MapPin,
  Cpu
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { SignaturePad } from "@/features/assets/components/SignaturePad";
import { toast } from "sonner";

// Sample Asset Data (In production, fetched via assetService.getAssetById(params.id))
const SAMPLE_ASSET = {
  id: "1",
  name: "MacBook Pro 14\"",
  serialNumber: "SN-99283-X",
  assetTag: "ASSET-001",
  type: "LAPTOP",
  status: "ASSIGNED",
  location: "Israel Office / Floor 4",
  assignedTo: {
    name: "John Doe",
    email: "john.doe@enterprise.com",
    avatar: ""
  },
  specs: {
    processor: "Apple M2 Pro",
    ram: "32GB",
    storage: "1TB SSD",
    display: "Liquid Retina XDR",
    os: "macOS Sonoma"
  },
  notes: "Assigned during onboarding on Jan 2024."
};

const SAMPLE_HISTORY = [
  { id: "h1", date: "Jan 12, 2024", type: "ASSIGNMENT", content: "Assigned to John Doe", user: "Admin" },
  { id: "h2", date: "Jan 10, 2024", type: "AUDIT", content: "Physical audit completed. Condition: Perfect.", user: "Technician A" },
  { id: "h3", date: "Jan 05, 2024", type: "MAINTENANCE", content: "Software updates and security hardening.", user: "Technician B" }
];

export default function AssetDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [auditDialogOpen, setAuditDialogOpen] = useState(false);

  const handleAuditSave = (signature: string) => {
    console.log("Saving audit with signature:", signature);
    toast.success("Audit completed successfully with signature.");
    setAuditDialogOpen(false);
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-6 pb-20">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{SAMPLE_ASSET.name}</h1>
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">{SAMPLE_ASSET.status}</Badge>
            </div>
            <p className="text-sm text-slate-500 font-mono">{SAMPLE_ASSET.assetTag} • {SAMPLE_ASSET.serialNumber}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="hidden md:flex">
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
            <Dialog open={auditDialogOpen} onOpenChange={setAuditDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <ShieldCheck className="mr-2 h-4 w-4" /> Audit Now
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Physical Asset Audit</DialogTitle>
                  <DialogDescription>
                    Verify current condition and location. Signature required for compliance.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-slate-500 text-xs uppercase font-semibold">Location</div>
                    <div className="text-slate-500 text-xs uppercase font-semibold">Date</div>
                    <div>{SAMPLE_ASSET.location}</div>
                    <div>{new Date().toLocaleDateString()}</div>
                  </div>
                  <SignaturePad
                    onSave={handleAuditSave}
                    onCancel={() => setAuditDialogOpen(false)}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-blue-500" /> Specifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(SAMPLE_ASSET.specs).map(([key, value]) => (
                    <div key={key} className="border-b border-slate-100 dark:border-slate-800 pb-2">
                      <dt className="text-xs font-semibold text-slate-400 uppercase">{key}</dt>
                      <dd className="text-slate-700 dark:text-slate-200">{value}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>

            <Tabs defaultValue="history" className="w-full">
              <TabsList className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 w-full justify-start rounded-none h-12">
                <TabsTrigger value="history" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none">
                  <History className="mr-2 h-4 w-4" /> Activity History
                </TabsTrigger>
                <TabsTrigger value="network" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none">
                  Network Details
                </TabsTrigger>
              </TabsList>
              <TabsContent value="history" className="mt-4">
                <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100 before:dark:bg-slate-800">
                  {SAMPLE_HISTORY.map((item) => (
                    <div key={item.id} className="relative">
                      <div className="absolute -left-[30px] top-1 px-1.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800">
                        <Clock className="h-3 w-3 text-slate-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold">{item.type}</span>
                          <span className="text-xs text-slate-400">{item.date}</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{item.content}</p>
                        <div className="text-xs text-slate-400 mt-1">By {item.user}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="network">
                <div className="p-8 text-center text-slate-500 text-sm">
                  No network telemetry available for this device yet.
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Assignment & Metadata */}
          <div className="space-y-6">
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-slate-50/50 dark:bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-md flex items-center justify-between">
                  Assignment
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold">
                    JD
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">{SAMPLE_ASSET.assignedTo.name}</div>
                    <div className="text-xs text-slate-500">{SAMPLE_ASSET.assignedTo.email}</div>
                  </div>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <MapPin className="h-4 w-4" />
                    {SAMPLE_ASSET.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <QrCode className="h-4 w-4" />
                    Print Asset Label
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-800 shadow-sm border-dashed">
              <CardHeader>
                <CardTitle className="text-md">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-slate-300 italic">
                  "{SAMPLE_ASSET.notes}"
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
