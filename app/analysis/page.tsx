import Navbar from "../components/navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { differences } from "@/lib/utils"

export default function AnalysisPage() {

    const analysisContent = `
      Section 1: Compliance with Republic Act No. 9165 (Comprehensive Dangerous Drugs Act).
      Section 2: Potential violation of the Civil Code of the Philippines regarding contracts.
      Section 3: Analysis of terms and clauses in light of recent Supreme Court rulings.
    `;

    const ocrContent = `
      Section 1: Compliance with republic Act No. 1234 (Comprehensive Drugs Act).
      Section 2: Potential violation of the Caval Code of the philippines regarding contracts.
      Section 6: Analysis of terms and clauses in light of recent Supreme Court rulings and cases.
    `;

    const diffContent = differences(analysisContent, ocrContent);

    return (
        <div className = "flex flex-col p-8">
            <Navbar />
            <div className="grid lg:grid-cols-2">
            {/* Left side: PDF Viewer */}
            <div className="h-screen pl-8 pr-8 pb-8">
                <iframe
                src={'/samplepdf.pdf'}
                width="100%"
                height="100%"
                title="Uploaded PDF"
                className=""
                ></iframe>
            </div>

            {/* Right side: Analysis */}
            <div className="pl-4">
                <Tabs defaultValue="Relevant Laws" className="w-full">
                    <TabsList>
                        <TabsTrigger value="Relevant Laws">Relevant Laws</TabsTrigger>
                        <TabsTrigger value="Issues">Issues</TabsTrigger>
                        <TabsTrigger value="Revisions">Revisions</TabsTrigger>
                        <TabsTrigger value="Differences">Differences</TabsTrigger>
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
                    <TabsContent value="Differences">
                        <Card>
                        <CardHeader>
                            <CardTitle>Differences with OCR scan</CardTitle>
                            <CardDescription>Card Description</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div>{diffContent}</div>
                        </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

            </div>
            </div>
        </div>
    );
    }
