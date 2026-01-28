import { IVaultRepository } from "@/lib/domain/repositories/IVaultRepository";
import { VaultItem } from "@/lib/domain/entities";
import { adminDb } from "@/lib/firebase/admin";
import { adminConverter } from "./admin-converters";

export class FirebaseVaultRepository implements IVaultRepository {
  private vaultCollection = adminDb.collection("vault").withConverter(adminConverter<VaultItem>());

  async findByTenant(tenantId: string): Promise<VaultItem[]> {
    const snapshot = await this.vaultCollection.where("tenantId", "==", tenantId).get();
    return snapshot.docs.map((doc: any) => doc.data());
  }

  async findById(tenantId: string, id: string): Promise<VaultItem | null> {
    const doc = await this.vaultCollection.doc(id).get();
    if (!doc.exists) return null;

    const data = doc.data() as VaultItem;
    if (data.tenantId !== tenantId) return null;

    return data;
  }

  async create(itemData: Omit<VaultItem, 'id' | 'updatedAt'>): Promise<VaultItem> {
    const now = new Date();
    const docRef = await this.vaultCollection.add({
      ...itemData,
      updatedAt: now,
    } as VaultItem);

    const snapshot = await docRef.get();
    return snapshot.data() as VaultItem;
  }

  async update(tenantId: string, id: string, updates: Partial<VaultItem>): Promise<void> {
    const item = await this.findById(tenantId, id);
    if (!item) throw new Error("Vault item not found or access denied");

    await this.vaultCollection.doc(id).update({
      ...updates,
      updatedAt: new Date(),
    });
  }

  async delete(tenantId: string, id: string): Promise<void> {
    const item = await this.findById(tenantId, id);
    if (!item) throw new Error("Vault item not found or access denied");

    await this.vaultCollection.doc(id).delete();
  }
}
