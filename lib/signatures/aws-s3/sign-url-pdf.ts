"use server"
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';
import { UploadFileSignedUrlResponse } from './types';
const generateFileName = (bytes = 16): string => {
  return crypto.randomBytes(bytes).toString('hex');
}

const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  }
})

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export async function getSignedURL(type: string, size: number, checksum: string): Promise<UploadFileSignedUrlResponse> {
  if (size > MAX_FILE_SIZE) {
    return { failure: { message: "File size exceeds the limit." } }
  }

  const validTypes = ["application/pdf", "image/jpeg", "image/png"];
  if (!validTypes.includes(type)) {
    return { failure: { message: "Invalid file type. Please upload a PDF or image file." } }
  }
  const key = generateFileName();
  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
    ContentType: "application/pdf",
    ContentLength: size,
    ChecksumSHA256: checksum,
  })

  const signedUrl = await getSignedUrl(s3, putObjectCommand, { expiresIn: 60 });

  return { success: { url: signedUrl, key: key } }
}