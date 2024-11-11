export interface ApiResponse {
  result: string;
}

export interface SignedUrlResponse {
  success?: {
    url: string;
  };
  failure?: {
    message: string;
  };
}

export interface PreviewFile {
  url: string | null;
  error: string | null;
}