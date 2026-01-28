"use server";

import { adminDb } from "@/lib/firebase/admin";
import { TicketStatus, TicketPriority } from "@/lib/domain/entities";

export async function submitPublicTicketAction(data: {
  tenantId: string;
  name: string;
  email: string;
  title: string;
  description: string;
  priority: TicketPriority;
  computerId?: string;
}) {
  try {
    if (!data.tenantId || !data.email || !data.title || !data.description) {
      throw new Error("Missing required fields");
    }

    const ticketRef = adminDb.collection("tickets").doc();

    await ticketRef.set({
      id: ticketRef.id,
      tenantId: data.tenantId,
      title: data.title,
      description: data.description,
      status: "OPEN" as TicketStatus,
      priority: data.priority,
      creatorId: "PUBLIC_GUEST",
      createdByEmail: data.email,
      createdByName: data.name,
      computerId: data.computerId || null,
      tags: ["PUBLIC_SUBMISSION"],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return { success: true, ticketId: ticketRef.id };
  } catch (error: any) {
    console.error("Public ticket submission failed:", error);
    return { success: false, error: error.message };
  }
}
