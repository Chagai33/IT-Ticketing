import { Ticket, TicketEvent } from "../entities";

export interface ITicketRepository {
  create(ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>): Promise<Ticket>;
  findById(tenantId: string, id: string): Promise<Ticket | null>;
  update(tenantId: string, id: string, updates: Partial<Ticket>): Promise<Ticket>;
  delete(tenantId: string, id: string): Promise<void>; // Soft delete

  // Queries
  findByTenant(tenantId: string, filters?: { status?: string, assignedTo?: string }): Promise<Ticket[]>;
  search(tenantId: string, query: string): Promise<Ticket[]>;

  // Events
  addEvent(tenantId: string, ticketId: string, event: Omit<TicketEvent, 'id' | 'createdAt'>): Promise<TicketEvent>;
  getEvents(tenantId: string, ticketId: string): Promise<TicketEvent[]>;
}
