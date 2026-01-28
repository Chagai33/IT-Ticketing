"use server";

import { adminAuth, adminDb } from "@/lib/firebase/admin";

export async function registerTenantAction(data: { idToken: string; companyName: string; adminName: string }) {
  try {
    // 0. Ensure Admin SDK is initialized
    if (!adminAuth) {
      return { success: false, error: "Server-side authentication is not configured. Check FIREBASE_SERVICE_ACCOUNT_KEY." };
    }

    // 1. Verify the ID token securely on the server
    const decodedToken = await adminAuth.verifyIdToken(data.idToken);
    const uid = decodedToken.uid;
    const email = decodedToken.email!;

    // 2. Generate new Tenant ID
    const tenantId = data.companyName.toLowerCase().replace(/[^a-z0-9]/g, '-') + "-" + Math.floor(Math.random() * 10000);

    // 3. Create User Record in Firestore
    await adminDb.collection("users").doc(uid).set({
      id: uid,
      tenantId,
      name: data.adminName,
      email,
      role: "ADMIN",
      source: "SELF_REGISTERED",
      isGuest: false,
      createdAt: new Date(),
    });

    // 4. Set Custom Claims for RLS (Row Level Security)
    await adminAuth.setCustomUserClaims(uid, { tenantId, role: "ADMIN" });

    return { success: true, tenantId };
  } catch (error: any) {
    console.error("Registration failed:", error);
    return { success: false, error: error.message };
  }
}
