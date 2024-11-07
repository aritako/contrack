"use client";
import { useState, ChangeEvent, FormEvent } from 'react';
import useUpload from '@/lib/hooks/useUpload';
import {young_serif} from '@/lib/fonts/fonts'
import "./globals.css"
import Navbar from './components/navbar';
export default function Home() {
  const { file, setFile, uploadFile, status } = useUpload();

  function handleFileChange(event: ChangeEvent<HTMLInputElement>): void {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    uploadFile();
  }
  
  return (
    <main className="container mx-auto p-8">
      <section className = "sticky top-0 mb-16">
        <Navbar/>
      </section>
      <section className = "flex justify-center items-center flex-col w-full">
        <div className = "max-w-xl">
          <div className = "flex flex-col items-center">
            <h2 className = "young-serif text-6xl max-w-xl text-center mb-4">Review Legal Documents Fast.</h2>
            <span className = "text-lg text-center">Effortlessly Spot Philippine Laws, Legal Issues and Agreement Contradictions with AI-Powered Insights.</span>
          </div>
          
          <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleFileChange} className="mb-4" />
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white">
              Upload and Analyze
            </button>
          </form>
        </div>
      </section>

      {status.error && (
        <div className="text-red-500 mt-4">{status.error}</div>
      )}
      {status.message && (
        <div className="text-green-500 mt-4">{status.message}</div>
      )}
    </main>
  );
}
