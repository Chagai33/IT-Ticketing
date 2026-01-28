"use server";

import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { UserRole } from "@/lib/domain/entities";
import { revalidatePath } from "next/cache";

export async function inviteUserAction(data: {
  tenantId: string; // Current admin's tenant
  email: string;
  role: UserRole;
  name: string;
}) {
  try {
    // 0. Ensure Admin SDK is initialized
    if (!adminAuth) {
      return { success: false, error: "Server-side authentication is not configured. Check your server logs and FIREBASE_SERVICE_ACCOUNT_KEY." };
    }

    // 1. Check if user already exists
    try {
      await adminAuth.getUserByEmail(data.email);
      return { success: false, error: "User already exists in system. Please simply add them to your tenant if supported, or ask them to login." };
    } catch (e: any) {
      if (e.code !== 'auth/user-not-found') throw e;
    }

    // 2. Create Invitation Record
    // We use a global 'invitations' collection or sharded? Global is easier for lookup during signup.
    const inviteRef = adminDb.collection("invitations").doc();
    const token = inviteRef.id; // Use Doc ID as token for simplicity

    await inviteRef.set({
      id: token,
      tenantId: data.tenantId,
      email: data.email.toLowerCase(),
      role: data.role,
      name: data.name,
      status: "PENDING",
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    // 3. (Mock) Send Email 
    // real implementation: await sendEmail({ to: data.email, subject: "Join Ticketing", link: `/register?invite=${token}` })
    console.log(`[MOCK EMAIL] To: ${data.email} | Link: http://localhost:3000/register?invite=${token}`);

    revalidatePath("/users");
    return { success: true, token };
  } catch (error: any) {
    console.error("Invite failed:", error);
    return { success: false, error: error.message };
  }
}

export async function joinTenantAction(data: {
  inviteToken: string;
  idToken: string;
}) {
  try {
    // 0. Ensure Admin SDK is initialized
    if (!adminAuth) {
      return { success: false, error: "Server-side authentication is not configured." };
    }

    // 1. Verify User Identity
    const decodedToken = await adminAuth.verifyIdToken(data.idToken);
    const uid = decodedToken.uid;
    const email = decodedToken.email!;

    // 2. Verify Invite
    const inviteRef = adminDb.collection("invitations").doc(data.inviteToken);
    const inviteDoc = await inviteRef.get();

    if (!inviteDoc.exists) {
      return { success: false, error: "Invalid or expired invitation." };
    }

    const invite = inviteDoc.data()!;
    if (invite.status !== "PENDING") {
      return { success: false, error: "Invitation already used." };
    }

    if (invite.email.toLowerCase() !== email.toLowerCase()) {
      return { success: false, error: "Email mismatch. Please register with the email address that was invited." };
    }

    // 3. Create User Profile
    await adminDb.collection("users").doc(uid).set({
      id: uid,
      tenantId: invite.tenantId,
      name: invite.name || "User",
      email: email,
      role: invite.role,
      source: "SELF_REGISTERED",
      isGuest: false,
      createdAt: new Date(),
    });

    // 4. Update Claims
    await adminAuth.setCustomUserClaims(uid, { tenantId: invite.tenantId, role: invite.role });

    // 5. Mark Invite Used
    await inviteRef.update({ status: "ACCEPTED", usedBy: uid, usedAt: new Date() });

    return { success: true, tenantId: invite.tenantId };

  } catch (error: any) {
    console.error("Join tenant failed:", error);
    return { success: false, error: error.message };
  }
}
