"use client";
import { useState, ChangeEvent, FormEvent, useRef, useEffect } from "react";
import useUpload from "@/lib/hooks/useUpload";
import { useRouter } from "next/navigation";
import { young_serif } from "@/lib/fonts/fonts";
import "./globals.css";
import "./styles.css";
import Navbar from "./components/navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowRight } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getSignedURL } from "../lib/signatures/aws-s3/sign-url-pdf";
import { PreviewFile } from "./types";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  const { filePDF, setFilePDF, fileImage, setFileImage, uploadFile, status } =
    useUpload();
  const [preview, setPreview] = useState<PreviewFile>({
    url: null,
    error: null,
  });
  const [preview2, setPreview2] = useState<PreviewFile>({
    url: null,
    error: null,
  });

  const fileInputPDFRef = useRef<HTMLInputElement>(null);
  const fileInputImageRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function handlePDFChange(event: ChangeEvent<HTMLInputElement>): void {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (preview.url) URL.revokeObjectURL(preview.url);

    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setPreview({
          url: null,
          error: "Invalid file type. Please upload a PDF.",
        });
        setFilePDF(null);
        if (fileInputPDFRef.current) fileInputPDFRef.current.value = "";
      } else {
        setFilePDF(selectedFile);
        setPreview({ url: URL.createObjectURL(selectedFile), error: null });
      }
    } else {
      setFilePDF(null);
      setPreview({ url: null, error: null });
    }
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>): void {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    // if (previewImage.url) URL.revokeObjectURL(previewImage.url);

    if (selectedFile) {
      // if (!selectedFile.type.startsWith('image/')) {
      if (selectedFile.type !== "application/pdf") {
        // setPreviewImage({ url: null, error: 'Invalid file type. Please upload an image.' });
        setPreview2({
          url: null,
          error: "Invalid file type. Please upload a PDF.",
        });
        setFileImage(null);
        if (fileInputImageRef.current) fileInputImageRef.current.value = "";
      } else {
        setFileImage(selectedFile);
        // setPreviewImage({ url: URL.createObjectURL(selectedFile), error: null });
        setPreview2({ url: URL.createObjectURL(selectedFile), error: null });
      }
    } else {
      setFileImage(null);
      // setPreviewImage({ url: null, error: null });
      setPreview2({ url: null, error: null });
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();
    console.log("submit", filePDF);
    await uploadFile();
  }

  useEffect(() => {
    if (status.key) {
      router.push(`/analysis/${status.key}`);
    }
  }, [status.key, router]);

  return (
    <>
      <section className="flex justify-center items-center flex-col w-full">
        <div className="max-w-xl">
          <div className="flex flex-col items-center mb-8">
            <h2 className="young-serif text-6xl max-w-xl text-center mb-4">
              Review Legal Contracts Fast.
            </h2>
            <span className="text-lg text-center">
              Effortlessly Spot Differences between Hard and Soft Copies of
              Contracts with AI-Powered Analysis.
            </span>
          </div>

          <form onSubmit={handleSubmit} className="flex mb-4 gap-2">
            <Input
              id="file"
              type="file"
              onChange={handlePDFChange}
              ref={fileInputPDFRef}
            />
            <Input
              id="file"
              type="file"
              onChange={handleImageChange}
              ref={fileInputPDFRef}
            />
            <Button type="submit" disabled={!filePDF}>
              Analyze <ArrowRight />
            </Button>
          </form>
          {preview.error && (
            <Alert className="mt-4 border-red-400 text-red-400">
              <AlertCircle className="stroke-red-400 h-4 w-4" />
              <AlertTitle>File Type Error.</AlertTitle>
              <AlertDescription>{preview.error}</AlertDescription>
            </Alert>
          )}
        </div>
        {status.error && (
          <div className="text-red-500 mt-4">API Error: {status.error}</div>
        )}
        {status.message && (
          <div className="text-green-500 mt-4">
            API Success: {status.message}
          </div>
        )}
      </section>
      {(preview.url || preview2.url) && (
        <section>
          <h2 className="young-serif text-2xl font-bold text-center mt-8">
            Preview
          </h2>
          <Tabs defaultValue="File1" className="w-full max-w-3xl mx-auto">
            <TabsList>
              <TabsTrigger value="File1">File 1</TabsTrigger>
              <TabsTrigger value="File2">File 2</TabsTrigger>
            </TabsList>

            <TabsContent value="File1">
              <div className="mt-4 w-full max-w-3xl mx-auto border border-stone-700 shadow-lg rounded-lg overflow-hidden">
                <iframe
                  src={preview.url || undefined}
                  width="100%"
                  height="800px"
                  className="rounded-lg"
                  title="PDF Preview"
                />
              </div>
            </TabsContent>
            <TabsContent value="File2">
              <div className="mt-4 w-full max-w-3xl mx-auto border border-stone-700 shadow-lg rounded-lg overflow-hidden">
                <iframe
                  src={preview2.url || undefined}
                  width="100%"
                  height="800px"
                  className="rounded-lg"
                  title="PDF Preview"
                />
              </div>
            </TabsContent>
          </Tabs>
        </section>
      )}
    </>
  );
}
