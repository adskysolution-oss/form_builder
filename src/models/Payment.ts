import mongoose, { Schema, Document, Model } from 'mongoose';

// Payment Model (Transaction logs)
export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId; // The user making the payment (or form respondent)
  formId?: mongoose.Types.ObjectId; // If payment is for a form
  amount: number;
  currency: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  gateway: 'RAZORPAY' | 'CASHFREE' | 'PAYU' | 'PHONEPE' | 'PAYTM';
  transactionId?: string;
  orderId?: string;
  receipt?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  formId: { type: Schema.Types.ObjectId, ref: 'Form' },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: { 
    type: String, 
    enum: ['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'],
    default: 'PENDING'
  },
  gateway: { 
    type: String, 
    enum: ['RAZORPAY', 'CASHFREE', 'PAYU', 'PHONEPE', 'PAYTM'],
    required: true
  },
  transactionId: { type: String },
  orderId: { type: String },
  receipt: { type: String },
}, { timestamps: true });

export const Payment: Model<IPayment> = mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);

// Gateway Settings Model (For User and Admin API Keys)
export interface IGatewaySettings extends Document {
  userId: mongoose.Types.ObjectId; // Admin user ID or normal user ID
  gateway: 'RAZORPAY' | 'CASHFREE' | 'PAYU' | 'PHONEPE' | 'PAYTM';
  isActive: boolean;
  credentials: Record<string, string>; // e.g., { keyId: "...", keySecret: "..." }
  commissionPercent?: number; // Only used if Admin is setting platform-wide commission
  createdAt: Date;
  updatedAt: Date;
}

const GatewaySettingsSchema = new Schema<IGatewaySettings>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  gateway: { 
    type: String, 
    enum: ['RAZORPAY', 'CASHFREE', 'PAYU', 'PHONEPE', 'PAYTM'],
    required: true
  },
  isActive: { type: Boolean, default: false },
  credentials: { type: Schema.Types.Mixed, required: true },
  commissionPercent: { type: Number, default: 0 }
}, { timestamps: true });

// Ensure one user can only have one setting per gateway
GatewaySettingsSchema.index({ userId: 1, gateway: 1 }, { unique: true });

export const GatewaySettings: Model<IGatewaySettings> = mongoose.models.GatewaySettings || mongoose.model<IGatewaySettings>('GatewaySettings', GatewaySettingsSchema);
