import { storage, BUCKETS, ID } from './config';
import type { Models } from 'appwrite';

export interface FileUploadResult {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  url: string;
  previewUrl?: string;
}

export class StorageService {
  /**
   * Upload a file to Appwrite storage
   */
  async uploadFile(
    file: File, 
    bucketId = BUCKETS.ATTACHMENTS
  ): Promise<FileUploadResult> {
    try {
      const uploadedFile = await storage.createFile(
        bucketId,
        ID.unique(),
        file
      );
      
      const url = this.getFileUrl(uploadedFile.$id, bucketId);
      const previewUrl = this.isImage(file.type) 
        ? this.getFilePreview(uploadedFile.$id, bucketId)
        : undefined;
      
      return {
        id: uploadedFile.$id,
        name: uploadedFile.name,
        size: uploadedFile.sizeOriginal,
        mimeType: uploadedFile.mimeType,
        url,
        previewUrl
      };
    } catch (error) {
      console.error('File upload failed:', error);
      throw new Error('Failed to upload file');
    }
  }

  /**
   * Upload multiple files
   */
  async uploadFiles(
    files: File[], 
    bucketId = BUCKETS.ATTACHMENTS
  ): Promise<FileUploadResult[]> {
    const uploads = files.map(file => this.uploadFile(file, bucketId));
    return Promise.all(uploads);
  }

  /**
   * Get the download URL for a file
   */
  getFileUrl(fileId: string, bucketId = BUCKETS.ATTACHMENTS): string {
    return storage.getFileDownload(bucketId, fileId).toString();
  }

  /**
   * Get a preview URL for image files
   */
  getFilePreview(
    fileId: string, 
    bucketId = BUCKETS.ATTACHMENTS,
    width = 300,
    height = 300
  ): string {
    return storage.getFilePreview(
      bucketId, 
      fileId, 
      width, 
      height
    ).toString();
  }

  /**
   * Delete a file from storage
   */
  async deleteFile(fileId: string, bucketId = BUCKETS.ATTACHMENTS): Promise<void> {
    try {
      await storage.deleteFile(bucketId, fileId);
    } catch (error) {
      console.error('File deletion failed:', error);
      throw new Error('Failed to delete file');
    }
  }

  /**
   * Upload a voice message as audio file
   */
  async uploadVoiceMessage(
    blob: Blob, 
    chatId: string
  ): Promise<FileUploadResult> {
    const timestamp = Date.now();
    const fileName = `voice_${chatId}_${timestamp}.webm`;
    
    // Convert blob to File
    const file = new File([blob], fileName, { 
      type: blob.type || 'audio/webm' 
    });
    
    return this.uploadFile(file, BUCKETS.VOICE_MESSAGES);
  }

  /**
   * Upload an avatar image
   */
  async uploadAvatar(file: File, userId: string): Promise<FileUploadResult> {
    // Validate image
    if (!this.isImage(file.type)) {
      throw new Error('File must be an image');
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      throw new Error('Image must be less than 5MB');
    }
    
    // Delete existing avatar if any
    try {
      const existing = await this.getUserAvatar(userId);
      if (existing) {
        await this.deleteFile(existing.id, BUCKETS.AVATARS);
      }
    } catch (error) {
      // Ignore - no existing avatar
    }
    
    return this.uploadFile(file, BUCKETS.AVATARS);
  }

  /**
   * Get user's avatar
   */
  async getUserAvatar(userId: string): Promise<FileUploadResult | null> {
    try {
      const files = await storage.listFiles(BUCKETS.AVATARS);
      const userAvatar = files.files.find(f => f.name.includes(userId));
      
      if (!userAvatar) return null;
      
      return {
        id: userAvatar.$id,
        name: userAvatar.name,
        size: userAvatar.sizeOriginal,
        mimeType: userAvatar.mimeType,
        url: this.getFileUrl(userAvatar.$id, BUCKETS.AVATARS),
        previewUrl: this.getFilePreview(userAvatar.$id, BUCKETS.AVATARS, 100, 100)
      };
    } catch (error) {
      console.error('Failed to get user avatar:', error);
      return null;
    }
  }

  /**
   * Check if a file type is an image
   */
  private isImage(mimeType: string): boolean {
    return mimeType.startsWith('image/');
  }

  /**
   * Check if a file type is a video
   */
  private isVideo(mimeType: string): boolean {
    return mimeType.startsWith('video/');
  }

  /**
   * Check if a file type is audio
   */
  private isAudio(mimeType: string): boolean {
    return mimeType.startsWith('audio/');
  }

  /**
   * Get appropriate icon for file type
   */
  getFileIcon(mimeType: string): string {
    if (this.isImage(mimeType)) return '🖼️';
    if (this.isVideo(mimeType)) return '🎬';
    if (this.isAudio(mimeType)) return '🎵';
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
    if (mimeType.includes('sheet') || mimeType.includes('excel')) return '📊';
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return '📊';
    if (mimeType.includes('zip') || mimeType.includes('archive')) return '🗜️';
    if (mimeType.includes('text')) return '📃';
    return '📎';
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Export singleton instance
export const storageService = new StorageService();