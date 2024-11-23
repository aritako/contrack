import { NextRequest, NextResponse } from 'next/server';
import { ComparisonModel } from '@/models/comparison';
import db_connection from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    await db_connection;
    const body = await request.json();
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
