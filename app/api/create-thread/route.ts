import OpenAI from "openai";
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';

// gets or creates openAI assistant
export async function GET() {
  const openai = new OpenAI();

  try {
    // edit path!!
    const path = "public/samplepdf.pdf"
    const fileStream = fs.createReadStream(path)

    // attach a file to a specific message, so need to upload it.
    const uploadedFile = await openai.files.create({
        file: fileStream,
        purpose: "assistants",
    });
  
    const thread = await openai.beta.threads.create({
        messages: [
        {
            role: "user",
            content:
            "Summarize the attached file",
            // "Analyze the attached file and find related Philippine laws on certain words or sentences in the file. If you find a related Philippine law, restate the sentence or phrase in the document and state which law is related to it.",
            // Attach the new file to the message.
            attachments: [{ file_id: uploadedFile.id, tools: [{ type: "file_search" }] }],
        },
        ],
    });
    
    // The thread now has a vector store in its tool resources.
    console.log(thread.tool_resources?.file_search);

    return NextResponse.json({ thread: thread }, {status: 200});
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: e });
  }
}
