"use server";

import { adminDb } from "@/lib/firebase/admin";

export async function getInviteDetailsAction(token: string) {
  try {
    const inviteDoc = await adminDb.collection("invitations").doc(token).get();

    if (!inviteDoc.exists) {
      return { success: false, error: "Invitation not found" };
    }

    const data = inviteDoc.data();

    if (data?.status !== "PENDING") {
      return { success: false, error: "Invitation is no longer valid" };
    }

    // Return only safe details
    return {
      success: true,
      email: data.email,
      name: data.name,
      tenantId: data.tenantId
    };

  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
