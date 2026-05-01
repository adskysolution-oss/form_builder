import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILead extends Document {
  formId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId; // The owner of the form
  data: Record<string, any>; // JSON data mapping field ID to value
  status: 'NEW' | 'CONTACTED' | 'CONVERTED';
  notes?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>({
  formId: { type: Schema.Types.ObjectId, ref: 'Form', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  data: { type: Schema.Types.Mixed, required: true }, // Mixed type for flexible JSON
  status: { 
    type: String, 
    enum: ['NEW', 'CONTACTED', 'CONVERTED'],
    default: 'NEW'
  },
  notes: { type: String },
  tags: [{ type: String }],
}, { timestamps: true });

export const Lead: Model<ILead> = mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);
