export interface FileMetadata {
  user_id: number;
  key: string;
  fileName: string;
  contentType: string;
  fileSize: number;
  uploadTime: string; // ISO FORMAT
}