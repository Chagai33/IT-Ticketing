"use server";

import { TicketService } from "@/lib/application/services/TicketService";
import { FirebaseTicketRepository } from "@/lib/infrastructure/firebase/FirebaseTicketRepository";
import { FirebaseUserRepository } from "@/lib/infrastructure/firebase/FirebaseUserRepository";
import { revalidatePath } from "next/cache";

const ticketRepo = new FirebaseTicketRepository();
const userRepo = new FirebaseUserRepository();
const ticketService = new TicketService(ticketRepo, userRepo);

export async function createTicketAction(formData: {
  tenantId: string;
  name?: string;
  email?: string;
  title: string;
  description: string;
  priority: any;
  computerId?: string;
}) {
  try {
    const ticket = await ticketService.createTicket(
      formData.tenantId,
      { name: formData.name || "Guest", email: formData.email || "guest@anonymous.com" },
      {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        computerId: formData.computerId,
      }
    );

    revalidatePath("/");
    revalidatePath("/tickets");
    return { success: true, ticket };
  } catch (error: any) {
    console.error("Server Action Error (createTicketAction):", error);
    return { success: false, error: error.message || "Failed to create ticket" };
  }
}

export async function addTicketCommentAction(tenantId: string, ticketId: string, userId: string, content: string) {
  try {
    await ticketService.addComment(tenantId, ticketId, userId, content);
    revalidatePath(`/tickets/${ticketId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateTicketStatusAction(tenantId: string, ticketId: string, userId: string, status: any) {
  try {
    if (status === "RESOLVED") {
      await ticketService.resolveTicket(tenantId, ticketId, userId);
    } else {
      await ticketRepo.update(tenantId, ticketId, { status });
    }
    revalidatePath(`/tickets/${ticketId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
