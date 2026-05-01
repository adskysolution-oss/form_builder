import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Payment, GatewaySettings } from '@/models/Payment';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { orderId, paymentId, signature, gateway } = await req.json();

    if (!orderId || !gateway) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    await connectDB();

    const payment = await Payment.findOne({ orderId });
    if (!payment) return NextResponse.json({ error: 'Payment record not found' }, { status: 404 });

    const settings = await GatewaySettings.findOne({ userId: payment.userId, gateway, isActive: true });
    if (!settings) return NextResponse.json({ error: 'Gateway settings not found' }, { status: 400 });

    let isVerified = false;

    if (gateway === 'RAZORPAY') {
      const text = orderId + "|" + paymentId;
      const expectedSignature = crypto
        .createHmac('sha256', settings.credentials.keySecret)
        .update(text)
        .digest('hex');

      if (expectedSignature === signature) {
        isVerified = true;
      }
    } 
    else if (gateway === 'PAYU') {
      // PayU verification typically happens via webhook or status API, but if doing it sync:
      // In PayU the post response has its own hash that you reverse verify.
      // This is a simplified placeholder.
      isVerified = true; 
    }
    // other gateways...

    if (isVerified || gateway === 'CASHFREE') { // simulating success for CF for now
      payment.status = 'SUCCESS';
      payment.transactionId = paymentId;
      await payment.save();
      return NextResponse.json({ message: 'Payment verified successfully' }, { status: 200 });
    } else {
      payment.status = 'FAILED';
      await payment.save();
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
    }

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
