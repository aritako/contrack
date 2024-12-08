import { useState } from 'react';
import { FileMetadata } from '@/models/comparison';
import { useUploadModel, uploadStatus, CreateComparisonResponse } from './types';
import { getSignedURL } from '@/lib/signatures/aws-s3/sign-url-pdf';
import { computeSHA256 } from '../utils';
import { ComparisonDocument } from '@/models/comparison';
import { v4 as uuidv4 } from 'uuid';

export default function useUpload(): useUploadModel {
  const [filePDF1, setFilePDF1] = useState<File | null>(null);
  const [filePDF2, setFilePDF2] = useState<File | null>(null);
  const [status, setStatus] = useState<uploadStatus>({
    message: null,
    key: null,
    error: null,
  });

  const validateSignedURL: (file: File) => Promise<{ url: string; key: string }> = async (file) => {
    const checksum = await computeSHA256(file);
    const signedURLResult = await getSignedURL(file.type, file.size, checksum);
    if (signedURLResult.failure !== undefined) {
      throw new Error(signedURLResult.failure.message);
    }
    if (!signedURLResult.success) {
      throw new Error('Failed to get signed URL.');
    }
    return signedURLResult.success;
  }

  const uploadFile: () => Promise<void> = async () => {
    if (!filePDF1 || !filePDF2) {
      setStatus({ message: null, key: null, error: 'No file selected.' });
      return;
    }
    try {
      const pdfSignedURL1 = await validateSignedURL(filePDF1);
      const pdfSignedURL2 = await validateSignedURL(filePDF2);
      await Promise.all([
        fetch(pdfSignedURL1.url, {
          method: 'PUT',
          body: filePDF1,
          headers: { 'Content-Type': filePDF1.type },
        }),
        fetch(pdfSignedURL2.url, {
          method: 'PUT',
          body: filePDF2,
          headers: { 'Content-Type': filePDF2.type },
        }),
      ]);

      const pdfMetadata1: FileMetadata = {
        key: pdfSignedURL1.key,
        fileName: filePDF1.name,
        contentType: filePDF1.type,
        fileSize: filePDF1.size,
        uploadTime: new Date(),
      }
      const pdfMetadata2: FileMetadata = {
        key: pdfSignedURL2.key,
        fileName: filePDF2.name,
        contentType: filePDF2.type,
        fileSize: filePDF2.size,
        uploadTime: new Date(),
      }

      const comparisonMetadata: Partial<ComparisonDocument> = {
        comparison_id: uuidv4(),
        user_id: 1,
        pdf_1: pdfMetadata1,
        pdf_2: pdfMetadata2,
        status: 'pending',
        result: null,
      } as ComparisonDocument;


      const createComparison: Response = await fetch('api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(comparisonMetadata),
      });
      if (!createComparison.ok) {
        console.log('API RESPONSE', createComparison);
        throw new Error(`Failed to upload file. ${createComparison.statusText}`);
      }

      const data: CreateComparisonResponse = await createComparison.json();
      console.log('OBTAIN DATA', data);
      setStatus({ message: null, key: data.body.comparison_id, error: null });
      console.log('STATUS', status);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setStatus({ message: null, key: null, error: err.message });
      } else {
        setStatus({
          message: null,
          key: null,
          error: 'An unknown error occurred.',
        });
      }
      return;
    }
  };
  return { filePDF1, setFilePDF1, filePDF2, setFilePDF2, uploadFile, status };
}
