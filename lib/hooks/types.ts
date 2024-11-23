export interface useUploadModel {
  filePDF: File | null;
  setFilePDF: (file: File | null) => void;
  fileImage: File | null;
  setFileImage: (file: File | null) => void;
  uploadFile: () => Promise<void>;
  status: uploadStatus;
}

export interface uploadStatus {
  message: string | null;
  key: string | null;
  error: string | null;
}
