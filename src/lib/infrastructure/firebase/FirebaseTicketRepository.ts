import { ITicketRepository } from "@/lib/domain/repositories/ITicketRepository";
import { Ticket, TicketEvent } from "@/lib/domain/entities";
import { adminDb } from "@/lib/firebase/admin"; // Server-side usage
import { adminConverter } from "./admin-converters";

export class FirebaseTicketRepository implements ITicketRepository {
  private ticketsCollection = adminDb.collection("tickets").withConverter(adminConverter<Ticket>());


  async create(ticketData: Omit<Ticket, "id" | "createdAt" | "updatedAt">): Promise<Ticket> {
    const now = new Date();
    const docRef = await this.ticketsCollection.add({
      ...ticketData,
      createdAt: now,
      updatedAt: now,
    } as Ticket);

    const snapshot = await docRef.get();
    return snapshot.data() as Ticket;
  }

  async findById(tenantId: string, id: string): Promise<Ticket | null> {
    if (!id) return null;
    const doc = await this.ticketsCollection.doc(id).get();
    if (!doc.exists) return null;

    const data = doc.data() as Ticket;
    // Strict Multi-Tenancy Check
    if (data.tenantId !== tenantId) {
      console.warn(`Unauthorized access attempt to ticket ${id} from tenant ${tenantId}`);
      return null;
    }

    return data;
  }

  async update(tenantId: string, id: string, updates: Partial<Ticket>): Promise<Ticket> {
    const ticket = await this.findById(tenantId, id);
    if (!ticket) throw new Error("Ticket not found or access denied");

    const docRef = this.ticketsCollection.doc(id);
    await docRef.update({
      ...updates,
      updatedAt: new Date(),
    });

    const snapshot = await docRef.get();
    return snapshot.data() as Ticket;
  }

  async delete(tenantId: string, id: string): Promise<void> {
    const ticket = await this.findById(tenantId, id);
    if (!ticket) throw new Error("Ticket not found or access denied");

    // Soft Delete
    await this.ticketsCollection.doc(id).update({
      deletedAt: new Date(),
    });
  }

  async findByTenant(tenantId: string, filters?: { status?: string; assignedTo?: string }): Promise<Ticket[]> {
    let query = this.ticketsCollection.where("tenantId", "==", tenantId);

    if (filters?.status) {
      query = query.where("status", "==", filters.status);
    }
    if (filters?.assignedTo) {
      query = query.where("assignedTechnicianId", "==", filters.assignedTo);
    }

    const snapshot = await query.get();
    return snapshot.docs.map((doc: any) => doc.data());
  }

  async search(tenantId: string, queryText: string): Promise<Ticket[]> {
    // Basic implementation - in real world would use Fuse.js or Algolia
    return this.findByTenant(tenantId);
  }

  async addEvent(tenantId: string, ticketId: string, eventData: Omit<TicketEvent, "id" | "createdAt">): Promise<TicketEvent> {
    const ticket = await this.findById(tenantId, ticketId);
    if (!ticket) throw new Error("Ticket not found or access denied");

    const eventsColl = this.ticketsCollection.doc(ticketId).collection("events").withConverter(adminConverter<TicketEvent>());
    const now = new Date();

    const docRef = await eventsColl.add({
      ...eventData,
      ticketId,
      createdAt: now,
    } as TicketEvent);

    const snapshot = await docRef.get();
    return snapshot.data() as TicketEvent;
  }

  async getEvents(tenantId: string, ticketId: string): Promise<TicketEvent[]> {
    const ticket = await this.findById(tenantId, ticketId);
    if (!ticket) throw new Error("Ticket not found or access denied");

    const eventsColl = this.ticketsCollection.doc(ticketId).collection("events").withConverter(adminConverter<TicketEvent>());
    const snapshot = await eventsColl.orderBy("createdAt", "asc").get();
    return snapshot.docs.map((doc: any) => doc.data());
  }
}
