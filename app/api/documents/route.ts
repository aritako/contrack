import { NextRequest, NextResponse } from 'next/server';
import { ComparisonDocument, ComparisonModel } from '@/models/comparison';
import db_connection from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    await db_connection
    const comparison_id = request.nextUrl.searchParams.get('comparison_id');
    let result;
    if (comparison_id) {
      result = await ComparisonModel.findOne({ comparison_id: comparison_id });
    } else {
      result = await ComparisonModel.find({});
    }
    if (!result) {
      return NextResponse.json({ error: 'Comparison not found' }, { status: 404, headers: { 'Content-Type': 'application/json' } });
    }
    return NextResponse.json(result, { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: `Internal Server Error: ${error}` }, { status: 500 });
  }
}


export async function POST(request: NextRequest) {
  try {
    await db_connection;
    const body: ComparisonDocument = await request.json();
    const comparison = new ComparisonModel({
      comparison_id: body.comparison_id,
      user_id: body.user_id,
      pdf: body.pdf,
      image: body.image,
      status: body.status,
      result: body.result,
    });

    const savedComparison = await comparison.save();
    console.log('Saved Document:', savedComparison);
    return NextResponse.json({ message: 'Comparison saved successfully', comparison });
  } catch (error) {
    console.error('Error saving comparison', error);
    return NextResponse.json({ message: `Failed to save comparison: ${error}` }, { status: 500 });
  }


}
