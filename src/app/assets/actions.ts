"use server";

import { assetService } from "@/lib/application/services/AssetService";
import { revalidatePath } from "next/cache";

export async function createAssetAction(formData: {
  tenantId: string;
  name: string;
  serialNumber: string;
  assetTag: string;
  type: any;
  status: any;
  location?: string;
}) {
  try {
    const asset = await assetService.createAsset({
      tenantId: formData.tenantId,
      name: formData.name,
      serialNumber: formData.serialNumber,
      assetTag: formData.assetTag,
      type: formData.type,
      status: formData.status,
      location: formData.location,
      specs: {}, // Added required empty specs
    });


    revalidatePath("/assets");
    return { success: true, asset };
  } catch (error: any) {
    console.error("Error creating asset:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteAssetAction(tenantId: string, id: string) {
  try {
    await assetService.deleteAsset(tenantId, id);
    revalidatePath("/assets");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
