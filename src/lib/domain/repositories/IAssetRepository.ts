import { Asset, AssetAudit } from "../entities";

export interface IAssetRepository {
  findAll(tenantId: string): Promise<Asset[]>;
  findById(tenantId: string, id: string): Promise<Asset | null>;
  findByUser(tenantId: string, userId: string): Promise<Asset[]>;
  create(asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>): Promise<Asset>;
  update(tenantId: string, id: string, asset: Partial<Asset>): Promise<void>;
  delete(tenantId: string, id: string): Promise<void>;

  // Audits / History
  addAudit(tenantId: string, audit: Omit<AssetAudit, 'id' | 'createdAt'>): Promise<AssetAudit>;
  getAudits(tenantId: string, assetId: string): Promise<AssetAudit[]>;
}
