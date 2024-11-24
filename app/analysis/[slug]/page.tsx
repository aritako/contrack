"use client"
import Navbar from "@/app/components/navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useEffect, useState } from "react";
import { ComparisonDocument, FileMetadata } from "@/models/comparison";
import { useParams } from "next/navigation";

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = useParams();
  const analysisContent = `
  <p>This document has been analyzed for potential conflicts with Philippine laws. Here are some insights:</p>
  <ul>
    <li><strong>Section 1:</strong> Compliance with Republic Act No. 9165 (Comprehensive Dangerous Drugs Act).</li>
    <li><strong>Section 2:</strong> Potential violation of the Civil Code of the Philippines regarding contracts.</li>
    <li><strong>Section 3:</strong> Analysis of terms and clauses in light of recent Supreme Court rulings.</li>
  </ul>
  `;
  const [comparisonData, setComparisonData] = useState<ComparisonDocument>();
  useEffect(() => {
    if (!slug) {
      return;
    }
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/documents?comparison_id=${slug}`);
        if (!response.ok) {
          throw new Error('Failed to fetch comparison data');
        }
        const data = await response.json();
        console.log("DATA RETRIEVED", data);
        setComparisonData(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [slug]);

  return (
    <div className="flex flex-col p-8">
      <div className="grid lg:grid-cols-2">
        {/* Left side: PDF Viewer */}
        <div className="h-screen pl-8 pr-8 pb-8">
          {comparisonData?.pdf.key ? (
            <iframe
              src={`${process.env.NEXT_PUBLIC_AWS_S3_ENDPOINT_URL}/${comparisonData.pdf.key}`}
              width="100%"
              height="100%"
              title="Uploaded PDF"
              className=""
            ></iframe>
          ) : (
            <p>Loading PDF...</p>
          )}
        </div>
        <div className="h-screen pl-8 pr-8 pb-8">
          {comparisonData?.pdf.key ? (
            <iframe
              src={`${process.env.NEXT_PUBLIC_AWS_S3_ENDPOINT_URL}/${comparisonData.image.key}`}
              width="100%"
              height="100%"
              title="Uploaded Image"
              className=""
            ></iframe>
          ) : (
            <p>Loading Image...</p>
          )}
        </div>
        {/* Right side: Analysis */}
        <div className="pl-4">
          <Tabs defaultValue="Relevant Laws" className="w-full">
            <TabsList>
              <TabsTrigger value="Relevant Laws">Relevant Laws</TabsTrigger>
              <TabsTrigger value="Issues">Issues</TabsTrigger>
              <TabsTrigger value="Revisions">Revisions</TabsTrigger>
            </TabsList>
            <TabsContent value="Relevant Laws">
              <Card>
                <CardHeader>
                  <CardTitle>Legal Analysis</CardTitle>
                  <CardDescription>Card Description</CardDescription>
                </CardHeader>
                <CardContent>
                  <div dangerouslySetInnerHTML={{ __html: analysisContent }} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="Issues">
              <Card>
                <CardHeader>
                  <CardTitle>Issues Found</CardTitle>
                  <CardDescription>Card Description</CardDescription>
                </CardHeader>
                <CardContent>
                  <div dangerouslySetInnerHTML={{ __html: analysisContent }} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="Revisions">
              <Card>
                <CardHeader>
                  <CardTitle>Suggested Revisions</CardTitle>
                  <CardDescription>Card Description</CardDescription>
                </CardHeader>
                <CardContent>
                  <div dangerouslySetInnerHTML={{ __html: analysisContent }} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

        </div>
      </div>
    </div>
  );
}
