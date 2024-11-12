import { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";
import { createReadStream } from "fs";
import path from "path";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // Read the file path from the request body
    const { filePath } = req.body;

    if (!filePath) {
      return res.status(400).json({ error: "File path is required." });
    }

    // Replace this with aws s3 path!
    
    // Ensure the file path is valid
    const fullFilePath = path.resolve(filePath);

    // Create a ReadStream from the file
    const fileStream = createReadStream(fullFilePath);

    const openai = new OpenAI();

    // Upload the file to OpenAI
    const response = await openai.files.create({
      file: fileStream, // Use the ReadStream for uploading
      purpose: "assistants",
    });

    res.status(200).json({ file: response });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e instanceof Error ? e.message : "Unknown error" });
  }
};

export default handler;
