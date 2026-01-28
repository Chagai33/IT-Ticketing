import { IUserRepository } from "@/lib/domain/repositories/IUserRepository";
import { User } from "@/lib/domain/entities";
import { adminDb } from "@/lib/firebase/admin";
import { adminConverter } from "./admin-converters";

export class FirebaseUserRepository implements IUserRepository {
  private usersCollection = adminDb.collection("users").withConverter(adminConverter<User>());

  async findById(tenantId: string, id: string): Promise<User | null> {
    const doc = await this.usersCollection.doc(id).get();
    if (!doc.exists) return null;

    const data = doc.data() as User;
    if (data.tenantId !== tenantId) return null;

    return data;
  }

  async findByEmail(tenantId: string, email: string): Promise<User | null> {
    const snapshot = await this.usersCollection
      .where("tenantId", "==", tenantId)
      .where("email", "==", email)
      .limit(1)
      .get();

    if (snapshot.empty) return null;
    return snapshot.docs[0].data();
  }

  async create(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const now = new Date();
    const docRef = await this.usersCollection.add({
      ...userData,
      createdAt: now,
    } as User);

    const snapshot = await docRef.get();
    return snapshot.data() as User;
  }

  async update(tenantId: string, id: string, updates: Partial<User>): Promise<void> {
    const user = await this.findById(tenantId, id);
    if (!user) throw new Error("User not found or access denied");

    await this.usersCollection.doc(id).update(updates);
  }

  async findByTenant(tenantId: string): Promise<User[]> {
    const snapshot = await this.usersCollection.where("tenantId", "==", tenantId).get();
    return snapshot.docs.map((doc: any) => doc.data());
  }
}
