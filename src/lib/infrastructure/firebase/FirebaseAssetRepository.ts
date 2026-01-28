import { IAssetRepository } from "@/lib/domain/repositories/IAssetRepository";
import { Asset, AssetAudit } from "@/lib/domain/entities";
import { adminDb } from "@/lib/firebase/admin";
import { adminConverter } from "./admin-converters";

export class FirebaseAssetRepository implements IAssetRepository {
  private assetsCollection = adminDb.collection("assets").withConverter(adminConverter<Asset>());


  async findAll(tenantId: string): Promise<Asset[]> {
    const snapshot = await this.assetsCollection.where("tenantId", "==", tenantId).get();
    return snapshot.docs.map((doc: any) => doc.data());
  }

  async findById(tenantId: string, id: string): Promise<Asset | null> {
    const doc = await this.assetsCollection.doc(id).get();
    if (!doc.exists) return null;

    const data = doc.data() as Asset;
    if (data.tenantId !== tenantId) return null;

    return data;
  }

  async findByUser(tenantId: string, userId: string): Promise<Asset[]> {
    const snapshot = await this.assetsCollection
      .where("tenantId", "==", tenantId)
      .where("assignedToId", "==", userId)
      .get();
    return snapshot.docs.map((doc: any) => doc.data());
  }

  async create(assetData: Omit<Asset, "id" | "createdAt" | "updatedAt">): Promise<Asset> {
    const now = new Date();
    const docRef = await this.assetsCollection.add({
      ...assetData,
      createdAt: now,
      updatedAt: now,
    } as Asset);

    const snapshot = await docRef.get();
    return snapshot.data() as Asset;
  }

  async update(tenantId: string, id: string, updates: Partial<Asset>): Promise<void> {
    const asset = await this.findById(tenantId, id);
    if (!asset) throw new Error("Asset not found or access denied");

    await this.assetsCollection.doc(id).update({
      ...updates,
      updatedAt: new Date(),
    });
  }

  async delete(tenantId: string, id: string): Promise<void> {
    const asset = await this.findById(tenantId, id);
    if (!asset) throw new Error("Asset not found or access denied");

    await this.assetsCollection.doc(id).delete();
  }

  async addAudit(tenantId: string, auditData: Omit<AssetAudit, "id" | "createdAt">): Promise<AssetAudit> {
    // Verify asset belongs to tenant
    const asset = await this.findById(tenantId, auditData.assetId);
    if (!asset) throw new Error("Asset not found or access denied");

    const auditsColl = adminDb.collection("asset_audits").withConverter(adminConverter<AssetAudit>());
    const now = new Date();
    const docRef = await auditsColl.add({
      ...auditData,
      createdAt: now,
    } as AssetAudit);

    const snapshot = await docRef.get();
    return snapshot.data() as AssetAudit;
  }

  async getAudits(tenantId: string, assetId: string): Promise<AssetAudit[]> {
    const asset = await this.findById(tenantId, assetId);
    if (!asset) throw new Error("Asset not found or access denied");

    const auditsColl = adminDb.collection("asset_audits").withConverter(adminConverter<AssetAudit>());
    const snapshot = await auditsColl.where("assetId", "==", assetId).orderBy("createdAt", "desc").get();
    return snapshot.docs.map((doc: any) => doc.data());
  }
}
