"use client";
import { useState, ChangeEvent, FormEvent } from 'react';
import useUpload from '@/lib/hooks/useUpload';
import {young_serif} from '@/lib/fonts/fonts'
import "./globals.css"
import "./styles.css"
import Navbar from './components/navbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

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
          
          <form onSubmit={handleSubmit} className='flex my-4 gap-2'>
            <Input id = "file" type = "file" onChange = {handleFileChange}/>
            <Button type="submit" disabled={!file}>
              Analyze <ArrowRight/>
            </Button>
          </form>
        </div>
        {status.error && (
        <div className="text-red-500 mt-4">API Error: {status.error}</div>
        )}
        {status.message && (
          <div className="text-green-500 mt-4">API Success: {status.message}</div>
        )}
      </section>
    </main>
  );
}
