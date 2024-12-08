import { ComparisonDocument } from "@/models/comparison";

export interface useUploadModel {
  filePDF1: File | null;
  setFilePDF1: (file: File | null) => void;
  filePDF2: File | null;
  setFilePDF2: (file: File | null) => void;
  uploadFile: () => Promise<void>;
  status: uploadStatus;
}

export interface uploadStatus {
  message: string | null;
  key: string | null;
  error: string | null;
}

export interface CreateComparisonResponse {
  message: string;
  body: ComparisonDocument;
}