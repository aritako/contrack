"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { ComparisonDocument, FileMetadata } from "@/models/comparison";
import { useParams } from "next/navigation";
import Tesseract from "tesseract.js";
import { differences } from "@/lib/utils";
import * as pdfjs from "pdfjs-dist";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = useParams();

  const [comparisonData, setComparisonData] = useState<ComparisonDocument>();
  const [ocrContent1, setOcrContent1] = useState<string | null>(null);
  const [ocrContent2, setOcrContent2] = useState<string | null>(null);
  const [diffContent, setDiffContent] = useState<JSX.Element | null>(null);

  useEffect(() => {
    if (!slug) {
      return;
    }
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/documents?comparison_id=${slug}`);
        if (!response.ok) {
          throw new Error("Failed to fetch comparison data");
        }
        const data = await response.json();
        console.log("DATA RETRIEVED", data);
        setComparisonData(data);

        const pdfUrl1 = `${process.env.NEXT_PUBLIC_AWS_S3_ENDPOINT_URL}/${data.pdf_1.key}`;
        const pdfUrl2 = `${process.env.NEXT_PUBLIC_AWS_S3_ENDPOINT_URL}/${data.pdf_2.key}`;
        const [ocrText1, ocrText2] = await Promise.all([
          extractTextFromPdf(pdfUrl1),
          extractTextFromPdf(pdfUrl2),
        ]);

        setOcrContent1(ocrText1);
        setOcrContent2(ocrText2);

        const differencesContent = differences(ocrText1, ocrText2);
        setDiffContent(differencesContent);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [slug]);

  const extractTextFromPdf = async (pdfUrl: string) => {
    const pdf = await pdfjs.getDocument(pdfUrl).promise;
    const numPages = pdf.numPages;
    let fullText = "";

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (context) {
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;

        const result = await Tesseract.recognize(canvas.toDataURL(), "eng", {
          logger: (m) => console.log(m),
        });
        fullText += result.data.text + "\n";
      }
    }
    return fullText;
  };

  return (
    <div className="flex flex-col">
      <div className="grid lg:grid-cols-2">
        {/* Left side: PDF Viewer */}
        <div className="h-screen pl-8 pr-8 pb-8">
          <Tabs defaultValue="PDF1" className="">
            <TabsList>
              <TabsTrigger value="PDF1">PDF 1</TabsTrigger>
              <TabsTrigger value="PDF2">PDF 2</TabsTrigger>
            </TabsList>
            <TabsContent value="PDF1">
              <div className="w-full max-w-3xl mx-auto border border-stone-700 shadow-lg rounded-lg overflow-hidden">
                {comparisonData?.pdf_1.key ? (
                  <iframe
                    src={`${process.env.NEXT_PUBLIC_AWS_S3_ENDPOINT_URL}/${comparisonData.pdf_1.key}`}
                    width="100%"
                    height="800px"
                    title="Uploaded PDF"
                    className="flex-grow"
                  ></iframe>
                ) : (
                  <p>Loading PDF...</p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="PDF2">
              <div className="w-full max-w-3xl mx-auto border border-stone-700 shadow-lg rounded-lg overflow-hidden">
                {comparisonData?.pdf_2.key ? (
                  <iframe
                    src={`${process.env.NEXT_PUBLIC_AWS_S3_ENDPOINT_URL}/${comparisonData.pdf_2.key}`}
                    width="100%"
                    height="800px"
                    title="Uploaded Image"
                    className=""
                  ></iframe>
                ) : (
                  <p>Loading PDF...</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        {/* Right side: Analysis */}
        <div className="pl-4">
          <Tabs defaultValue="Differences" className="w-full">
            <TabsList>
              <TabsTrigger value="Differences">Differences</TabsTrigger>
              <TabsTrigger value="Content1">Content 1</TabsTrigger>
              <TabsTrigger value="Content2">Content 2</TabsTrigger>
            </TabsList>
            <TabsContent value="Differences">
              <CardHeader>
                <CardTitle>Differences with OCR scan</CardTitle>
                <CardDescription>
                  <span className="text-green-500">additions</span>{" "}
                  <span className="text-red-400">deletions</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap">{diffContent}</div>
              </CardContent>
            </TabsContent>
            <TabsContent value="Content1">
              <Card>
                <CardHeader>
                  <CardTitle>OCR scan of PDF 1</CardTitle>
                </CardHeader>
                <CardContent>
                  {ocrContent2 ? (
                    <div className="whitespace-pre-wrap">{ocrContent1}</div>
                  ) : (
                    <p>Loading OCR content...</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="Content2">
              <Card>
                <CardHeader>
                  <CardTitle>OCR scan of PDF 2</CardTitle>
                </CardHeader>
                <CardContent>
                  {ocrContent2 ? (
                    <div className="whitespace-pre-wrap">{ocrContent2}</div>
                  ) : (
                    <p>Loading OCR content...</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
