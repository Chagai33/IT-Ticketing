import { TicketWizard } from "@/features/tickets/components/TicketWizard";
import { notFound } from "next/navigation";
import { adminDb } from "@/lib/firebase/admin";

interface Props {
  params: {
    tenantId: string;
  };
}

// Check if tenant exists by checking if any user belongs to it
async function verifyTenant(tenantId: string) {
  const snapshot = await adminDb.collection("users").where("tenantId", "==", tenantId).limit(1).get();
  return !snapshot.empty;
}

export default async function PublicPortalPage({ params }: Props) {
  const { tenantId } = params;

  const isValid = await verifyTenant(tenantId);
  if (!isValid) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="mb-8 text-center">
        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
          T
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Support Portal</h1>
        <p className="text-slate-500 mt-2">Submit a ticket to your IT team</p>
      </div>

      <div className="w-full max-w-2xl">
        <TicketWizard publicTenantId={tenantId} />
      </div>
    </div>
  );
}
