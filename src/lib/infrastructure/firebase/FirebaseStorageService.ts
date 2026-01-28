import { IStorageService } from "@/lib/domain/services/IStorageService";
import { storage } from "@/lib/firebase/client"; // Use Client SDK for direct uploads (or use Admin SDK for server-side generation)
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

// Note: In a production environment with strict Security Rules, 
// "getUploadUrl" typically generates a Signed URL via Admin SDK.
// For Firebase Client SDK simplicity in this "Free Tier" demo, 
// we return a token/path that the client uses directly, 
// but we structure it to match the Interface Contract for future S3 swap.

export class FirebaseStorageService implements IStorageService {
  async getUploadUrl(filename: string, contentType: string, tenantId: string): Promise<{ uploadUrl: string; publicUrl: string; }> {
    // In Firebase Client SDK, we don't "get" an upload URL like S3 Presigned URLs.
    // Instead, we just define the path where it SHOULD go.
    // The actual upload happens on the client using the SDK.
    // To maintain the `IStorageService` abstraction, we'll return the 'path' as the 'uploadUrl' 
    // and the client adapter will know how to handle it.

    // Path Sanitization: tenantId/date/uuid-filename
    const dateFolder = new Date().toISOString().split('T')[0];
    const uniqueName = `${uuidv4()}-${filename.replace(/[^a-zA-Z0-9\.\-]/g, "_")}`;
    const fullPath = `${tenantId}/${dateFolder}/${uniqueName}`;

    // We can't generate a public URL until it's uploaded, 
    // but we can predict it if the bucket is public (not recommended) 
    // or return the path to fetch via getDownloadURL later.

    return {
      uploadUrl: fullPath, // Logic: Client uses this path with `ref(storage, path)`
      publicUrl: "", // Will be resolved after upload
    };
  }

  // Client-side helper (not part of strict interface but useful for this implementation)
  async uploadFile(path: string, file: File, onProgress?: (progress: number) => void): Promise<string> {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress?.(progress);
        },
        (error) => {
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  }

  async deleteFile(path: string): Promise<void> {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  }
}

export const storageService = new FirebaseStorageService();
