import Image from 'next/image';
import { useState, ChangeEvent, FormEvent } from 'react';
import { ApiResponse } from './types';
export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<ApiResponse | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    const result: ApiResponse = await res.json();
    setResponse(result);
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

      {response && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Analysis Result</h2>
          <p>{response.result}</p>
        </div>
      )}
    </div>
  );
}
