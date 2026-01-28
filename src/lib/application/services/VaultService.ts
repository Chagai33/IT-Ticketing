import { IVaultRepository } from "@/lib/domain/repositories/IVaultRepository";
import { FirebaseVaultRepository } from "@/lib/infrastructure/firebase/FirebaseVaultRepository";
import { VaultItem } from "@/lib/domain/entities";
import { encrypt, decrypt } from "@/lib/infrastructure/security/crypto";

class VaultService {
  private encryptionKey: string;

  constructor(private repository: IVaultRepository) {
    this.encryptionKey = process.env.ENCRYPTION_KEY || "";
  }

  async getSecrets(tenantId: string) {
    return this.repository.findByTenant(tenantId);
  }

  async createSecret(data: Omit<VaultItem, 'id' | 'updatedAt' | 'value'>, plainValue: string) {
    if (!this.encryptionKey) throw new Error("Encryption key missing");

    const encryptedValue = encrypt(plainValue, this.encryptionKey);
    return this.repository.create({
      ...data,
      value: encryptedValue,
    });
  }

  async revealSecret(tenantId: string, id: string): Promise<string> {
    const item = await this.repository.findById(tenantId, id);
    if (!item || !this.encryptionKey) return "";

    return decrypt(item.value, this.encryptionKey);
  }

  async deleteSecret(tenantId: string, id: string) {
    return this.repository.delete(tenantId, id);
  }
}

export const vaultService = new VaultService(new FirebaseVaultRepository());
