import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import connectDB from '@/lib/db';
import { Lead } from '@/models/Lead';
import { Form } from '@/models/Form';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'supersecretjwtkey'
);

export async function GET(req: Request) {
  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as string;

    const { searchParams } = new URL(req.url);
    const formId = searchParams.get('formId');
    const status = searchParams.get('status');

    await connectDB();

    let query: any = { userId };
    if (formId) query.formId = formId;
    if (status) query.status = status;

    const leads = await Lead.find(query)
      .populate('formId', 'title')
      .sort({ createdAt: -1 });

    return NextResponse.json({ leads }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as string;

    const { leadId, status, notes, tags } = await req.json();

    await connectDB();

    const lead = await Lead.findOne({ _id: leadId, userId });
    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

    if (status) lead.status = status;
    if (notes !== undefined) lead.notes = notes;
    if (tags) lead.tags = tags;

    await lead.save();

    return NextResponse.json({ message: 'Lead updated successfully', lead }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
