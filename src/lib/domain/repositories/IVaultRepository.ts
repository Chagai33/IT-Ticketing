import { VaultItem } from "../entities";

export interface IVaultRepository {
  findByTenant(tenantId: string): Promise<VaultItem[]>;
  findById(tenantId: string, id: string): Promise<VaultItem | null>;
  create(item: Omit<VaultItem, 'id' | 'updatedAt'>): Promise<VaultItem>;
  update(tenantId: string, id: string, updates: Partial<VaultItem>): Promise<void>;
  delete(tenantId: string, id: string): Promise<void>;
}
