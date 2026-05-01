import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPageSection {
  id: string;
  type: 'HERO' | 'FEATURES' | 'TESTIMONIALS' | 'CTA' | 'FOOTER';
  content: Record<string, any>;
}

export interface ILandingPage extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  sections: IPageSection[];
  isPublished: boolean;
  theme: {
    primaryColor: string;
    fontFamily: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const SectionSchema = new Schema<IPageSection>({
  id: { type: String, required: true },
  type: { type: String, required: true },
  content: { type: Schema.Types.Mixed, default: {} },
}, { _id: false });

const LandingPageSchema = new Schema<ILandingPage>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  sections: [SectionSchema],
  isPublished: { type: Boolean, default: false },
  theme: {
    primaryColor: { type: String, default: '#3b82f6' },
    fontFamily: { type: String, default: 'Inter' },
  }
}, { timestamps: true });

export const LandingPage: Model<ILandingPage> = mongoose.models.LandingPage || mongoose.model<ILandingPage>('LandingPage', LandingPageSchema);
