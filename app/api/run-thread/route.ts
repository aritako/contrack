import OpenAI from "openai";
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';

// the endpoint connecting create-asst, create-thread, and finally runs the thread.
export async function GET() {
  const openai = new OpenAI();

  let assistant, thread;

  // CREATE/RETRIEVE OPENAI ASSISTANT
  try {
    const assistantsResponse = await openai.beta.assistants.list();
    const assistants = assistantsResponse.data;
    
     // search for existing assistant
    assistant = assistants.find(
        (asst) => asst.name === 'Filipino Lawyer'
    );

    // create assistant if Filipino Lawyer assistant does not exist
    if (!assistant){
        assistant = await openai.beta.assistants.create({
            instructions: `
            You are an expert in document comparison so you are really good at inspecting the WHOLE document. 
            When you are given two documents, you need to spot the differences between the documents, whether it is just certain words, sentences, or whole paragraphs. 
            `,
            // instructions: `
            // You are an expert in reading documents, so you are really good at transcribing the text of images and files. 
            // When you are given documents, you are tasked to provide the whole text of the document.
            // `,
            name: "Filipino Lawyer",
            tools: [{ type: "file_search" }],
            model: "gpt-4-turbo",
            });
        console.log(assistant)
    } 
    // return NextResponse.json({assistant}, {status: 200})
  } catch (e) {
    console.log("failed to create/fetch assistant");
    return NextResponse.json({ error: e }, {status: 500});
  }


  // CREATE A THREAD
  try {
    // edit path!!
    const path = "public/test.pdf"
    const fileStream = fs.createReadStream(path)

    // attach a file to a specific message, so need to upload it.
    const uploadedFile = await openai.files.create({
        file: fileStream,
        purpose: "assistants",
    });

    const path2 = "public/test2.pdf"
    const fileStream2 = fs.createReadStream(path2)

    // attach a file to a specific message, so need to upload it.
    const uploadedFile2 = await openai.files.create({
        file: fileStream2,
        purpose: "assistants",
    });
  
    thread = await openai.beta.threads.create({
        messages: [
        {
            role: "user",
            content:
            "Extract the whole text content inside the attached document",
            // "Given the attachments, once document is an edited version of the other. Read the entire documents and tell me exactly the differences between the two documents. Just tell me the differences and nothing else.",
            // Attach the new file to the message.
            attachments: [{ file_id: uploadedFile.id, tools: [{ type: "file_search" }] }, { file_id: uploadedFile2.id, tools: [{ type: "file_search" }] }],
        },
        ],
    });
    
    // The thread now has a vector store in its tool resources.
    console.log(thread.tool_resources?.file_search);
    // return NextResponse.json({thread}, {status: 200});
  } catch(e) {
    console.log("failed to create thread!");
    return NextResponse.json({ error: e }, {status: 500});
  }

  // RUN MESSAGE
  try{
    const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: assistant.id,
    });
     
    const messages = await openai.beta.threads.messages.list(thread.id, {
      run_id: run.id,
    });

    return NextResponse.json({messages}, {status: 200});
  } catch(e) {
    console.log("failed to create run!");
    return NextResponse.json({ error: e }, {status: 500});
  }
}
