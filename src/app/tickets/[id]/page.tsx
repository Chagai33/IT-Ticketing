import { FirebaseTicketRepository } from "@/lib/infrastructure/firebase/FirebaseTicketRepository";
import { FirebaseUserRepository } from "@/lib/infrastructure/firebase/FirebaseUserRepository";
import AppShell from "@/components/layout/AppShell";
import {
  ChevronLeft,
  MoreHorizontal,
  Clock,
  Monitor,
  CheckCircle2,
  CircleEllipsis,
  ArrowRightLeft,
  User
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TicketChat } from "@/features/tickets/components/TicketChat";
import { addTicketCommentAction, updateTicketStatusAction } from "../actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

export default async function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tenantId = "demo";
  const ticketRepo = new FirebaseTicketRepository();
  const userRepo = new FirebaseUserRepository();

  const ticket = await ticketRepo.findById(tenantId, id);

  if (!ticket) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
          <p className="text-slate-500 font-medium">Ticket not found or access denied.</p>
          <Link href="/tickets">
            <Button variant="outline">Back to Tickets</Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  const events = await ticketRepo.getEvents(tenantId, id);
  const creator = await userRepo.findById(tenantId, ticket.creatorId);

  // We pass a server-binded action to the client component
  const handleAddComment = async (content: string) => {
    "use server";
    return addTicketCommentAction(tenantId, id, "tech-1", content);
  };

  const handleResolve = async () => {
    "use server";
    return updateTicketStatusAction(tenantId, id, "tech-1", "RESOLVED");
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-6 pb-20 max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-4">
          <div className="flex items-center gap-4">
            <Link href="/tickets">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{ticket.id.substring(0, 8)}</h1>
                <Badge variant="outline" className="bg-amber-100 text-amber-800 border-none px-2 font-bold">{ticket.priority}</Badge>
              </div>
              <h2 className="text-lg text-slate-500 dark:text-slate-400 font-medium">{ticket.title}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <form action={handleResolve}>
              <Button type="submit" variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-semibold shadow-sm">
                <CheckCircle2 className="mr-2 h-4 w-4" /> Resolve
              </Button>
            </form>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <ArrowRightLeft className="mr-2 h-4 w-4" /> Merge with another ticket
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" /> Reassign
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  Close Ticket
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none bg-white/50 backdrop-blur-sm">
              <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 py-3 border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <CircleEllipsis className="h-4 w-4 text-blue-500" /> Issue Description
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {ticket.description}
                </p>
                <div className="mt-6 flex gap-2 flex-wrap">
                  {ticket.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold text-[10px] px-2 py-0 border-none">
                      #{tag.toUpperCase()}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <TicketChat
              ticketId={id}
              currentUser={{ id: "tech-1", name: "Technician Ben" }}
              initialEvents={JSON.parse(JSON.stringify(events))}
              onAddComment={handleAddComment}
            />
          </div>

          <div className="space-y-6">
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <CardHeader className="py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">Request Context</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Requester</label>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white font-black shadow-lg shadow-blue-500/20">
                      {creator?.name.substring(0, 2).toUpperCase() || '??'}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white leading-none">{creator?.name || 'Unknown'}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{creator?.email || 'No email provided'}</div>
                    </div>
                  </div>
                </div>

                {ticket.computerId && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-50 dark:border-slate-800">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Linked Asset</label>
                    <div className="mt-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center gap-3 group hover:border-blue-200 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center">
                        <Monitor className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold truncate">Asset Linked</div>
                        <div className="text-[10px] text-slate-400 font-mono italic truncate">{ticket.computerId}</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-1 pt-2 border-t border-slate-50 dark:border-slate-800">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Ticket Timeline</label>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                    <Clock className="h-3.5 w-3.5 text-slate-300" />
                    Opened on {ticket.createdAt.toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-100 dark:border-blue-900 shadow-xl shadow-blue-500/5 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/10 dark:to-slate-900 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full -mr-10 -mt-10 blur-2xl" />
              <CardContent className="pt-6 relative">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-black text-[10px] uppercase tracking-widest">
                  <CheckCircle2 className="h-4 w-4" />
                  AI Smart Insight
                </div>
                <p className="text-xs text-blue-700/80 dark:text-blue-300/80 mt-3 leading-relaxed font-semibold italic">
                  "This issue mirrors 4 previous cases resolved by updating the network driver. Recommend checking the adapter settings first."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
