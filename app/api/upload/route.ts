import { NextRequest, NextResponse } from 'next/server';
import { FileMetadata } from './types';
import clientPromise from '@/lib/db';
export async function POST(request: NextRequest) {
  const formData: FormData = await request.formData();
  const uploadRequest: FileMetadata = {
    user_id: 1,
    key: formData.get('key') as string,
    fileName: formData.get('fileName') as string,
    contentType: formData.get('contentType') as string,
    fileSize: parseInt(formData.get('fileSize') as string),
    uploadTime: formData.get('uploadTime') as string,
  };

  // Validate uploadRequest fields
  for (const [key, value] of Object.entries(uploadRequest)) {
    if (value === null || value === undefined) {
      return NextResponse.json(
        { error: `Field '${key}' is required.` },
        { status: 400 }
      );
    }
  }

  const client = await clientPromise;
  const db = client.db('documents');
  const movies = db.collection('upload-file');
  const data = await movies.insertOne(uploadRequest);
  return NextResponse.json(
    { message: 'File uploaded successfully.', key: uploadRequest.key },
    { status: 200 }
  );
  // const uploadRequest: FileMetadata = {
  //   file: formData.get('file') as File,
  // };

  // if (!uploadRequest.file) {
  //   return NextResponse.json(
  //     { error: "No files received." },
  //     { status: 400 }
  //   );
  // }
  // const buffer = Buffer.from(await uploadRequest.file.arrayBuffer());
  // const filename = uploadRequest.file.name;
  // return NextResponse.json(
  //   { message: filename },
  //   { status: 200 }
  // );
}
