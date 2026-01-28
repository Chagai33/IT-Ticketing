export interface IStorageService {
  /**
   * Generates a secure upload URL (Presigned URL for S3, or direct upload token for Firebase)
   */
  getUploadUrl(filename: string, contentType: string, tenantId: string): Promise<{ uploadUrl: string, publicUrl: string }>;

  /**
   * Deletes a file from storage
   */
  deleteFile(path: string): Promise<void>;
}
