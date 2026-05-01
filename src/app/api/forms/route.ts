import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import connectDB from '@/lib/db';
import { Form } from '@/models/Form';
import slugify from 'slugify';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'supersecretjwtkey'
);

export async function POST(req: Request) {
  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as string;

    const { title, fields, settings } = await req.json();

    if (!title) {
      return NextResponse.json({ error: 'Form title is required' }, { status: 400 });
    }

    await connectDB();

    // Generate unique slug
    let baseSlug = slugify(title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;
    while (await Form.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newForm = await Form.create({
      userId,
      title,
      slug,
      fields: fields || [],
      settings: settings || {}
    });

    return NextResponse.json({ message: 'Form created successfully', form: newForm }, { status: 201 });
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
    const forms = await Form.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ forms }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
