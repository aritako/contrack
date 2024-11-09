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