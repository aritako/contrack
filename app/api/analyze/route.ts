import { ComparisonModel } from "@/models/comparison";
import { NextRequest, NextResponse } from "next/server";
import * as pdfjs from "pdfjs-dist";
import Tesseract from "tesseract.js";
import { diffWords } from "diff"

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

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
        logger: (m) => console.log("IM WORKING",m),
      });
      fullText += result.data.text + "\n";
    }
  }
  return fullText;
};

export async function POST(request: NextRequest){
  try{
    const body = await request.json()
    const comparison_id = body.comparison_id
    const result = await ComparisonModel.findOne({ comparison_id: comparison_id });
    if (!result) {
      return NextResponse.json({ error: 'Comparison not found' }, { status: 404, headers: { 'Content-Type': 'application/json' } });
    }
    const pdfUrl1 = `${process.env.NEXT_PUBLIC_AWS_S3_ENDPOINT_URL}/${result.pdf_1.key}`;
    const pdfUrl2 = `${process.env.NEXT_PUBLIC_AWS_S3_ENDPOINT_URL}/${result.pdf_2.key}`;
    const [ocrText1, ocrText2] = await Promise.all([
      extractTextFromPdf(pdfUrl1),
      extractTextFromPdf(pdfUrl2),
    ]);
    const differences = diffWords(ocrText1, ocrText2);
    return NextResponse.json({message: 'Success', body: differences})
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: `Internal Server Error: ${error}` }, { status: 500 });
  }
}