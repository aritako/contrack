export interface UploadFileSignedUrlResponse {
  success?: {
    url: string;
    key: string;
  };
  failure?: {
    message: string;
  };
}
