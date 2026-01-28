import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from "firebase/firestore"; // Client SDK types, but compatible logic

export const genericConverter = <T>(): FirestoreDataConverter<T> => ({
  toFirestore(modelObject: WithFieldValue<T>): DocumentData {
    return modelObject as DocumentData;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): T {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      ...data,
    } as T;
  },
});
