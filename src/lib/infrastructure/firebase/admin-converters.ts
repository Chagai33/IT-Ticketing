import { FirestoreDataConverter, QueryDocumentSnapshot, WithFieldValue, Timestamp } from "firebase-admin/firestore";

const convertTimestamps = (data: any): any => {
  if (data instanceof Timestamp) {
    return data.toDate();
  }
  if (Array.isArray(data)) {
    return data.map(convertTimestamps);
  }
  if (data && typeof data === 'object') {
    return Object.keys(data).reduce((acc, key) => {
      acc[key] = convertTimestamps(data[key]);
      return acc;
    }, {} as any);
  }
  return data;
};

export const adminConverter = <T>(): FirestoreDataConverter<T> => ({
  toFirestore(modelObject: WithFieldValue<T>): FirebaseFirestore.DocumentData {
    return modelObject as FirebaseFirestore.DocumentData;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot
  ): T {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      ...convertTimestamps(data),
    } as T;
  },
});
