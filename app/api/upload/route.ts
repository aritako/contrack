import { NextRequest, NextResponse } from 'next/server';
import { UploadRequestModel } from './types';
export async function POST(request: NextRequest) {
  const formData: FormData = await request.formData();
  const uploadRequest: UploadRequestModel = {
    file: formData.get('file') as File,
  };

  if(!uploadRequest.file) {
    return NextResponse.json(
      {error: "No files received."},
      {status: 400}
    );
  }
  const buffer = Buffer.from(await uploadRequest.file.arrayBuffer());
  const filename = uploadRequest.file.name;
  return NextResponse.json(
    { message: filename },
    { status: 200 }
  );
}