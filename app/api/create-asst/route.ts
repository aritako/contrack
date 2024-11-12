import OpenAI from "openai";

// gets or creates openAI assistant
export async function GET() {
  const openai = new OpenAI();

  try {
    const assistantsResponse = await openai.beta.assistants.list();
    const assistants = assistantsResponse.data;
    
     // search for existing assistant
    const existingAssistant = assistants.find(
      (assistant) => assistant.name === 'Filipino Lawyer'
    );

    if (existingAssistant) return Response.json({assistant: existingAssistant});

    const newAssistant = await openai.beta.assistants.create({
      instructions: `
      You are a professional lawyer from the Philippines who conducts legal reviews of documents in the Philippines, so you are knowledgable about the Philippine Laws. 
      Use your knowledge base to answer questions and complete tasks regarding legal documents.
     `,
      name: "Filipino Lawyer",
      tools: [{ type: "file_search" }],
      model: "gpt-4-1106-preview",
    });

    console.log(newAssistant);

    return Response.json({ assistant: newAssistant });
  } catch (e) {
    console.log(e);
    return Response.json({ error: e });
  }
}
