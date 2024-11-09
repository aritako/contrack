"use server"
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { SignedUrlResponse } from './types';
const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  }
})

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export async function getSignedURL(type: string, size: number, checksum: string): Promise<SignedUrlResponse> {
  if (size > MAX_FILE_SIZE) {
    return { failure: { message: "File size exceeds the limit." } }
  }

  if (type !== "application/pdf") {
    return { failure: { message: "Invalid file type. Please upload a PDF file." } }
  }

  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: "test-file",
    ContentType: "application/pdf",
    ContentLength: size,
    ChecksumSHA256: checksum,
  })

  const signedUrl = await getSignedUrl(s3, putObjectCommand, { expiresIn: 60 });

  return { success: { url: signedUrl } }
}