import { IAssetRepository } from "@/lib/domain/repositories/IAssetRepository";
import { FirebaseAssetRepository } from "@/lib/infrastructure/firebase/FirebaseAssetRepository";
import { Asset, AssetAudit } from "@/lib/domain/entities";

class AssetService {
  constructor(private repository: IAssetRepository) { }

  async getAllAssets(tenantId: string) {
    return this.repository.findAll(tenantId);
  }

  async getAssetById(tenantId: string, id: string) {
    return this.repository.findById(tenantId, id);
  }

  async getUserAssets(tenantId: string, userId: string) {
    return this.repository.findByUser(tenantId, userId);
  }

  async createAsset(data: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.repository.create(data);
  }

  async updateAsset(tenantId: string, id: string, updates: Partial<Asset>) {
    return this.repository.update(tenantId, id, updates);
  }

  async deleteAsset(tenantId: string, id: string) {
    return this.repository.delete(tenantId, id);
  }

  async auditAsset(tenantId: string, data: Omit<AssetAudit, 'id' | 'createdAt'>) {
    return this.repository.addAudit(tenantId, data);
  }

  async getAssetHistory(tenantId: string, assetId: string) {
    return this.repository.getAudits(tenantId, assetId);
  }
}

export const assetService = new AssetService(new FirebaseAssetRepository());
