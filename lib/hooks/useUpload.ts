import { useState } from 'react';
import { useUploadModel, uploadStatus } from './types';
import { getSignedURL } from '@/app/actions';
import { computeSHA256 } from '../utils';

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
    const { url } = signedURLResult.success;
    // Upload file to S3
    try {
      const response: Response = await fetch(url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to upload file.')
      }

      setStatus({ message: 'File uploaded successfully.', error: null });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setStatus({ message: null, error: err.message });
      } else {
        setStatus({ message: null, error: 'An unknown error occurred.' });
      }
      return;
    }

    const formData: FormData = new FormData();
    formData.append('file', file);
    try {
      const response: Response = await fetch('api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload file.')
      }

      const data: { message: string } = await response.json();
      setStatus({ message: data.message, error: null });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setStatus({ message: null, error: err.message });
      } else {
        setStatus({ message: null, error: 'An unknown error occurred.' });
      }
    }
  }
  return { file, setFile, uploadFile, status };
}