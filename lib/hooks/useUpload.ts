import { useState } from 'react';
import { useUploadModel, uploadStatus } from './types';

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