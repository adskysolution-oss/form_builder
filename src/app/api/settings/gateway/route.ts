import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import connectDB from '@/lib/db';
import { GatewaySettings } from '@/models/Payment';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'supersecretjwtkey'
);

export async function POST(req: Request) {
  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as string;

    const { gateway, isActive, credentials, commissionPercent } = await req.json();

    if (!gateway || !credentials) {
      return NextResponse.json({ error: 'Gateway name and credentials are required' }, { status: 400 });
    }

    await connectDB();

    // Upsert the gateway settings for this user
    const settings = await GatewaySettings.findOneAndUpdate(
      { userId, gateway },
      { isActive, credentials, commissionPercent },
      { new: true, upsert: true }
    );

    return NextResponse.json({ message: 'Gateway settings saved successfully', settings }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as string;

    await connectDB();

    const settings = await GatewaySettings.find({ userId });
    
    // Do not return raw secrets in production normally, but for a settings page the user needs to see them or mask them
    // For this implementation, returning them to populate the form
    return NextResponse.json({ settings }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
