import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPlan extends Document {
  name: string;
  price: number;
  features: {
    maxForms: number;
    maxResponses: number;
    customDomain: boolean;
    removeBranding: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const PlanSchema: Schema<IPlan> = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    features: {
      maxForms: { type: Number, required: true },
      maxResponses: { type: Number, required: true },
      customDomain: { type: Boolean, default: false },
      removeBranding: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export const Plan: Model<IPlan> = mongoose.models.Plan || mongoose.model<IPlan>('Plan', PlanSchema);
