import { useState } from 'react';
import { useUploadModel, uploadStatus } from './types';
import { getSignedURL } from '@/lib/signatures/aws-s3/sign-url-pdf';
import { computeSHA256 } from '../utils';
import { FileMetadata } from '@/app/api/upload/types';

export default function useUpload(): useUploadModel {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<uploadStatus>({
    message: null,
    error: null,
  });

  const uploadFile: () => Promise<void> = async () => {
    if (!file) {
      setStatus({ message: null, error: 'No file selected.' });
      return;
    }
    const checksum = await computeSHA256(file);
    const signedURLResult = await getSignedURL(file.type, file.size, checksum);
    if (signedURLResult.failure !== undefined) {
      setStatus({ message: null, error: signedURLResult.failure.message });
      return;
    }
    if (!signedURLResult.success) {
      setStatus({ message: null, error: 'Failed to get signed URL.' });
      return;
    }
    const { url, key } = signedURLResult.success;
    try {
      const responseS3: Response = await fetch(url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      })

      if (!responseS3.ok) {
        throw new Error('Failed to upload file.')
      }

      const formData = new FormData();
      const fileMetadata: FileMetadata = {
        user_id: 1,
        key: key,
        fileName: file.name,
        contentType: file.type,
        fileSize: file.size,
        uploadTime: new Date().toISOString(),
      }
      Object.entries(fileMetadata).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
      const responseDB: Response = await fetch('api/upload', {
        method: 'POST',
        body: formData,
      })
      if (!responseDB.ok) {
        throw new Error('Failed to upload file.')
      }

      const data: { message: string } = await responseDB.json();
      setStatus({ message: data.message, error: null });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setStatus({ message: null, error: err.message });
      } else {
        setStatus({ message: null, error: 'An unknown error occurred.' });
      }
      return;
    }
  }
  return { file, setFile, uploadFile, status };
}