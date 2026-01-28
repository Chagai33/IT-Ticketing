import { User } from "../entities";

export interface IUserRepository {
  findById(tenantId: string, id: string): Promise<User | null>;
  findByEmail(tenantId: string, email: string): Promise<User | null>;
  create(user: Omit<User, 'id' | 'createdAt'>): Promise<User>;
  update(tenantId: string, id: string, updates: Partial<User>): Promise<void>;
  findByTenant(tenantId: string): Promise<User[]>;
}
