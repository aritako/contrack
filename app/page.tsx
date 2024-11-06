"use client";
import { useState, ChangeEvent, FormEvent } from 'react';
import useUpload from '@/lib/hooks/useUpload';
export default function Home() {
  const { file, setFile, uploadFile, status } = useUpload();
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    uploadFile();
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Upload Document for Analysis</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} className="mb-4" />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white">
          Upload and Analyze
        </button>
      </form>

      {status.error && (
        <div className="text-red-500 mt-4">{status.error}</div>
      )}
      {status.message && (
        <div className="text-green-500 mt-4">{status.message}</div>
      )}
    </div>
  );
}
