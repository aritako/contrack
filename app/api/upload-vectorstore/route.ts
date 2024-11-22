import OpenAI from "openai";
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';

// gets or creates openAI assistant
export async function GET() {
  const openai = new OpenAI();

  try {
    // edit path!!
    const path = "public/sample.pdf"
    const fileStream = fs.createReadStream(path)

    const vectorStoresResponse = await openai.beta.vectorStores.list();
    const vectorStores = vectorStoresResponse.data;

    let vectorStore = vectorStores.find(
      (vs) => vs.name === 'Legiscan Documents'
    );
    
    if (!vectorStore){
      vectorStore = await openai.beta.vectorStores.create({
        name: "Legiscan Documents",
      });
    }

    const uploadedFile = await openai.files.create({
      file: fileStream,
      purpose: "assistants",
    })
     
    const myVectorStoreFile = await openai.beta.vectorStores.files.create(
      vectorStore.id,
      {
        file_id: uploadedFile.id
      }
    );
    
    await openai.beta.vectorStores.fileBatches.uploadAndPoll(vectorStore.id, fileStreams)

    return NextResponse.json({ assistant: newAssistant }, {status: 200});
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: e });
  }
}
