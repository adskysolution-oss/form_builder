import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Form } from '@/models/Form';
import { Lead } from '@/models/Lead';

export async function POST(req: Request, { params }: { params: { formId: string } }) {
  try {
    const { data } = await req.json();
    
    if (!data) {
      return NextResponse.json({ error: 'Submission data is required' }, { status: 400 });
    }

    await connectDB();

    const form = await Form.findById(params.formId);
    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    const newLead = await Lead.create({
      formId: form._id,
      userId: form.userId,
      data,
      status: 'NEW'
    });

    return NextResponse.json({ 
      message: form.settings.successMessage || 'Thank you! Your response has been recorded.', 
      leadId: newLead._id 
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
