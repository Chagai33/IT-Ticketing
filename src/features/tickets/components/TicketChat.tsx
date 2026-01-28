"use client";

import { useState, useRef, useEffect } from "react";
import { TicketEvent } from "@/lib/domain/entities";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, User } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface TicketChatProps {
  ticketId: string;
  initialEvents: TicketEvent[];
  // In a real app, this would be a server action passed down
  onAddComment: (content: string) => Promise<void>;
  currentUser: { id: string; name: string };
}

export function TicketChat({ ticketId, initialEvents, onAddComment, currentUser }: TicketChatProps) {
  const [events, setEvents] = useState<TicketEvent[]>(initialEvents);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  const handleSubmit = async () => {
    if (!input.trim() || isSending) return;

    const content = input.trim();
    setInput(""); // Clear input immediately
    setIsSending(true);

    // Optimistic Update
    const optimisticEvent: TicketEvent = {
      id: `temp-${Date.now()}`,
      ticketId,
      type: "COMMENT",
      content,
      createdBy: currentUser.id,
      createdAt: new Date(),
    };

    setEvents((prev) => [...prev, optimisticEvent]);

    try {
      await onAddComment(content);
      // Real update would come from revalidating data, but for now we assume success
      toast.success("Comment sent");
    } catch (error) {
      // Rollback on error
      setEvents((prev) => prev.filter(e => e.id !== optimisticEvent.id));
      setInput(content); // Restore content
      toast.error("Failed to send comment");
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
        <h3 className="font-semibold text-slate-900 dark:text-white">Ticket Activity</h3>
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6">
        {events.length === 0 && (
          <div className="text-center text-slate-400 my-10">No messages yet. Start the conversation!</div>
        )}

        {events.map((event) => {
          const isMe = event.createdBy === currentUser.id;
          return (
            <div key={event.id} className={cn("flex gap-3", isMe ? "flex-row-reverse" : "flex-row")}>
              <Avatar className="w-8 h-8">
                <AvatarFallback className={cn(isMe ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-700")}>
                  {isMe ? "ME" : <User className="w-4 h-4" />}
                </AvatarFallback>
              </Avatar>
              <div className={cn(
                "max-w-[80%] rounded-lg p-3 text-sm",
                isMe
                  ? "bg-blue-600 text-white rounded-tr-none"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none"
              )}>
                <div className="whitespace-pre-wrap">{event.content}</div>
                <div className={cn(
                  "text-[10px] mt-1 opacity-70",
                  isMe ? "text-blue-100" : "text-slate-500"
                )}>
                  {format(event.createdAt, "HH:mm")}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Type a message..."
            className="min-h-[2.5rem] max-h-32 resize-none bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus-visible:ring-blue-500"
          />
          <Button
            size="icon"
            onClick={handleSubmit}
            disabled={!input.trim() || isSending}
            className="h-10 w-10 shrink-0 bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="text-xs text-slate-400 mt-2 px-1">
          Press <kbd className="font-mono bg-slate-200 dark:bg-slate-800 px-1 rounded">Enter</kbd> to send, <kbd className="font-mono bg-slate-200 dark:bg-slate-800 px-1 rounded">Shift+Enter</kbd> for new line
        </div>
      </div>
    </div>
  );
}
