"use server";

import { vaultService } from "@/lib/application/services/VaultService";
import { revalidatePath } from "next/cache";

export async function createSecretAction(formData: {
  tenantId: string;
  title: string;
  category: string;
  value: string;
  notes?: string;
  entityId?: string;
  entityType?: string;
}) {
  try {
    const secret = await vaultService.createSecret(
      {
        tenantId: formData.tenantId,
        title: formData.title,
        category: formData.category as any,
        notes: formData.notes,
        entityId: formData.entityId,
        entityType: formData.entityType as any,
        updatedBy: "SYSTEM", // Placeholder for session user
      },
      formData.value
    );


    revalidatePath("/vault");
    return { success: true, secret };
  } catch (error: any) {
    console.error("Error creating secret:", error);
    return { success: false, error: error.message };
  }
}

export async function revealSecretAction(tenantId: string, id: string) {
  try {
    const secret = await vaultService.revealSecret(tenantId, id);
    return { success: true, value: secret };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteSecretAction(tenantId: string, id: string) {
  try {
    await vaultService.deleteSecret(tenantId, id);
    revalidatePath("/vault");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
