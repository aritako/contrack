export interface useUploadModel {
  file: File | null;
  setFile: (file: File | null) => void;
  uploadFile: () => Promise<void>;
  status: uploadStatus;
}

export interface uploadStatus {
  message: string | null;
  key: string | null;
  error: string | null;
}
