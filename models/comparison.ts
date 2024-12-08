import mongoose, { Schema, Document, Model } from 'mongoose';

export interface FileMetadata {
  key: string;
  fileName: string;
  contentType: string;
  fileSize: number;
  uploadTime: Date;
}

export interface ComparisonDocument extends Document {
  comparison_id: string;
  user_id: number;
  pdf_1: FileMetadata;
  pdf_2: FileMetadata;
  status: 'pending' | 'processing' | 'completed';
  result: string | null; // e.g., match, mismatch, or additional details
}

export const FileMetadataSchema: Schema = new Schema<FileMetadata>({
  key: { type: String, required: true },
  fileName: { type: String, required: true },
  contentType: { type: String, required: true },
  fileSize: { type: Number, required: true },
  uploadTime: { type: Date, required: true },
});

export const ComparisonSchema: Schema<ComparisonDocument> = new Schema<ComparisonDocument>({
  comparison_id: { type: String, required: true, unique: true },
  user_id: { type: Number, required: true },
  pdf_1: { type: FileMetadataSchema, required: true },
  pdf_2: { type: FileMetadataSchema, required: true },
  status: { type: String, enum: ['pending', 'processing', 'completed'], default: 'pending' },
  result: { type: String, default: null },
}, { collection: 'comparison' });

export const ComparisonModel: Model<ComparisonDocument> =
  mongoose.models.Comparison || mongoose.model<ComparisonDocument>('Comparison', ComparisonSchema);
