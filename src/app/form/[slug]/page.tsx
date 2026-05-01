import connectDB from "@/lib/db";
import { Form } from "@/models/Form";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import TypeformRenderer from "@/components/TypeformRenderer";

export default async function PublicFormPage({ params }: { params: { slug: string } }) {
  await connectDB();
  const form = await Form.findOne({ slug: params.slug });

  if (!form) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <TypeformRenderer form={JSON.parse(JSON.stringify(form))} />
    </div>
  );
}
