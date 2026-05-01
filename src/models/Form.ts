import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFormField {
  id: string; // unique frontend id (e.g. from dnd-kit)
  type: 'TEXT' | 'EMAIL' | 'PHONE' | 'DROPDOWN' | 'CHECKBOX' | 'FILE' | 'PAYMENT';
  label: string;
  required: boolean;
  options?: string[]; // for dropdown/checkbox
  placeholder?: string;
}

export interface IForm extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description?: string;
  fields: IFormField[];
  settings: {
    themeColor: string;
    submitText: string;
    successMessage: string;
    isPublished: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const FormFieldSchema = new Schema<IFormField>({
  id: { type: String, required: true },
  type: { type: String, required: true },
  label: { type: String, required: true },
  required: { type: Boolean, default: false },
  options: [{ type: String }],
  placeholder: { type: String },
}, { _id: false });

const FormSchema = new Schema<IForm>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  fields: [FormFieldSchema],
  settings: {
    themeColor: { type: String, default: '#3b82f6' },
    submitText: { type: String, default: 'Submit' },
    successMessage: { type: String, default: 'Thank you! Your response has been recorded.' },
    isPublished: { type: Boolean, default: false },
  }
}, { timestamps: true });

export const Form: Model<IForm> = mongoose.models.Form || mongoose.model<IForm>('Form', FormSchema);
