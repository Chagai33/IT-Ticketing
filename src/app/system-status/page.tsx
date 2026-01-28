import { AlertTriangle, CheckCircle, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SystemStatusPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
      <div className="max-w-xl w-full bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-100">
        <div className="p-8 text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center">
            <Server className="w-10 h-10 text-amber-500" />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-900">System Status</h1>
            <p className="text-slate-500 mt-2">
              Real-time status of system components
            </p>
          </div>

          <div className="space-y-4">
            <StatusItem name="Database (Firestore)" status="operational" />
            <StatusItem name="Authentication" status="operational" />
            <StatusItem name="File Storage" status="operational" />
            <StatusItem name="AI Services (Gemini)" status="degraded" />
          </div>
        </div>

        <div className="bg-slate-50 p-6 flex justify-center border-t border-slate-100">
          <Button asChild variant="outline">
            <Link href="/">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function StatusItem({ name, status }: { name: string; status: 'operational' | 'degraded' | 'outage' }) {
  const config = {
    operational: { icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10", label: "Operational" },
    degraded: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10", label: "Degraded Performance" },
    outage: { icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10", label: "Major Outage" },
  };

  const { icon: Icon, color, bg, label } = config[status];

  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-white border border-slate-200 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${bg}`}>
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
        <span className="font-medium text-slate-700">{name}</span>
      </div>
      <span className={`text-sm font-medium ${color}`}>
        {label}
      </span>
    </div>
  );
}
