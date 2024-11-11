import clientPromise from '@lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("sample_mflix");
    const movies = db.collection('movies');
    const data = await movies
      .find({})
      .sort({ metacritic: -1 })
      .limit(5)
      .toArray();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
