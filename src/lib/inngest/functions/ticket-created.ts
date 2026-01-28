import { inngest } from "@/lib/inngest/client";
import { aiService } from "@/lib/infrastructure/ai/GeminiService";
import { adminDb } from "@/lib/firebase/admin"; // Using Admin SDK for background updates

export const ticketCreated = inngest.createFunction(
  { id: "ticket-created-classification" },
  { event: "ticket/created" },
  async ({ event, step }) => {
    const { ticketId, title, description, tenantId } = event.data;

    // Step 1: Analyze with AI
    const analysis = await step.run("analyze-ticket", async () => {
      return await aiService.classifyTicket(title, description);
    });

    // Step 2: Update Ticket in DB
    await step.run("update-ticket-metadata", async () => {
      await adminDb.collection("tickets").doc(ticketId).update({
        priority: analysis.priority,
        tags: analysis.tags
      });
    });

    return { success: true, analysis };
  }
);
