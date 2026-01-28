import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { ticketCreated } from "@/lib/inngest/functions/ticket-created";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    ticketCreated,
  ],
});
