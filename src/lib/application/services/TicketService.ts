import { ITicketRepository } from "@/lib/domain/repositories/ITicketRepository";
import { IUserRepository } from "@/lib/domain/repositories/IUserRepository";
import { Ticket, User } from "@/lib/domain/entities";

export class TicketService {
  constructor(
    private ticketRepo: ITicketRepository,
    private userRepo: IUserRepository // Dependency for JIT registration
  ) { }

  async createTicket(
    tenantId: string,
    creatorInfo: { id?: string; email: string; name: string },
    data: { title: string; description: string; priority: Ticket["priority"]; computerId?: string; tags?: string[] }
  ): Promise<Ticket> {
    let userId = creatorInfo.id;

    // 1. Just-in-Time (JIT) Registration Logic
    if (!userId) {
      const existingUser = await this.userRepo.findByEmail(tenantId, creatorInfo.email);
      if (existingUser) {
        userId = existingUser.id;
      } else {
        // Create as GUEST if not found
        const newUser = await this.userRepo.create({
          tenantId,
          name: creatorInfo.name,
          email: creatorInfo.email,
          role: "USER",
          source: "SELF_REGISTERED",
          isGuest: true,
        });
        userId = newUser.id;
      }
    }

    const ticket = await this.ticketRepo.create({
      tenantId,
      creatorId: userId!,
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: "OPEN",
      computerId: data.computerId,
      tags: data.tags || [],
      assignedTechnicianId: undefined,
    });

    return ticket;
  }


  async addComment(tenantId: string, ticketId: string, userId: string, content: string): Promise<void> {
    await this.ticketRepo.addEvent(tenantId, ticketId, {
      ticketId,
      type: "COMMENT",
      content,
      createdBy: userId,
    });
  }

  async resolveTicket(tenantId: string, ticketId: string, userId: string): Promise<void> {
    await this.ticketRepo.update(tenantId, ticketId, { status: "RESOLVED" });
    await this.ticketRepo.addEvent(tenantId, ticketId, {
      ticketId,
      type: "STATUS_CHANGE",
      content: "Ticket resolved",
      createdBy: userId,
    });
  }
}
