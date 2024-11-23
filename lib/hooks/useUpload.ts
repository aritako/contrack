import { useState } from 'react';
import { FileMetadata } from '@/models/comparison';
import { useUploadModel, uploadStatus } from './types';
import { getSignedURL } from '@/lib/signatures/aws-s3/sign-url-pdf';
import { computeSHA256 } from '../utils';
import { ComparisonDocument } from '@/models/comparison';
import { v4 as uuidv4 } from 'uuid';

export default function useUpload(): useUploadModel {
  const [filePDF, setFilePDF] = useState<File | null>(null);
  const [fileImage, setFileImage] = useState<File | null>(null);
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
    if (!filePDF || !fileImage) {
      setStatus({ message: null, key: null, error: 'No file selected.' });
      return;
    }
    try {
      const pdfSignedURL = await validateSignedURL(filePDF);
      const imageSignedURL = await validateSignedURL(fileImage);
      await Promise.all([
        fetch(pdfSignedURL.url, {
          method: 'PUT',
          body: filePDF,
          headers: { 'Content-Type': filePDF.type },
        }),
        fetch(imageSignedURL.url, {
          method: 'PUT',
          body: fileImage,
          headers: { 'Content-Type': fileImage.type },
        }),
      ]);

      const pdfMetadata: FileMetadata = {
        key: pdfSignedURL.key,
        fileName: filePDF.name,
        contentType: filePDF.type,
        fileSize: filePDF.size,
        uploadTime: new Date(),
      }
      const imageMetadata: FileMetadata = {
        key: imageSignedURL.key,
        fileName: fileImage.name,
        contentType: fileImage.type,
        fileSize: fileImage.size,
        uploadTime: new Date(),
      }

      const comparisonMetadata: Partial<ComparisonDocument> = {
        comparison_id: uuidv4(),
        user_id: 1,
        pdf: pdfMetadata,
        image: imageMetadata,
        status: 'pending',
        result: null,
      } as ComparisonDocument;

      // Object.entries(ComparisonMetadata).forEach(([key, value]) => {
      //   formData.append(key, value);
      // });

      const responseDB: Response = await fetch('api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(comparisonMetadata),
      });
      if (!responseDB.ok) {
        console.log('RESPONSE DB', responseDB);
        throw new Error(`Failed to upload file. ${responseDB.statusText}`);
      }

      const data: { message: string; key: string } = await responseDB.json();
      console.log('OBTAIN DATA', data);
      setStatus({ message: data.message, key: data.key, error: null });
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
  return { filePDF, setFilePDF, fileImage, setFileImage, uploadFile, status };
}
