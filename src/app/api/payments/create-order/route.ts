import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Form } from '@/models/Form';
import { GatewaySettings, Payment } from '@/models/Payment';
import Razorpay from 'razorpay';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { formId, amount, gateway, email, name, phone } = await req.json();

    if (!formId || !amount || !gateway) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    await connectDB();

    const form = await Form.findById(formId);
    if (!form) return NextResponse.json({ error: 'Form not found' }, { status: 404 });

    // Fetch user's gateway settings
    const settings = await GatewaySettings.findOne({ userId: form.userId, gateway, isActive: true });
    
    if (!settings) {
      return NextResponse.json({ error: `${gateway} is not configured or active for this form` }, { status: 400 });
    }

    let orderId = '';
    let responseData: any = {};

    if (gateway === 'RAZORPAY') {
      const { keyId, keySecret } = settings.credentials;
      const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
      
      const order = await razorpay.orders.create({
        amount: Math.round(amount * 100), // in paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}_${Math.floor(Math.random()*1000)}`
      });
      orderId = order.id;
      responseData = { orderId: order.id, keyId };
    } 
    else if (gateway === 'CASHFREE') {
      // Basic simulation for the sake of structure, as real Cashfree integration requires specific headers and API versions
      orderId = `cf_${Date.now()}`;
      responseData = { paymentSessionId: "simulated_session_id_for_cashfree", orderId };
    }
    else if (gateway === 'PAYU') {
      const { keyId: merchantKey, keySecret: salt } = settings.credentials;
      const txnid = `payu_${Date.now()}`;
      orderId = txnid;
      const productinfo = `Payment for form ${form.title}`;
      const hashString = `${merchantKey}|${txnid}|${amount}|${productinfo}|${name}|${email}|||||||||||${salt}`;
      const hash = crypto.createHash('sha512').update(hashString).digest('hex');
      responseData = { txnid, hash, merchantKey, productinfo };
    }
    else {
      return NextResponse.json({ error: `Gateway ${gateway} integration is pending` }, { status: 501 });
    }

    // Log the payment attempt
    await Payment.create({
      userId: form.userId,
      formId: form._id,
      amount,
      gateway,
      orderId,
      status: 'PENDING'
    });

    return NextResponse.json(responseData, { status: 200 });
  } catch (error: any) {
    console.error("Payment Order Error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
