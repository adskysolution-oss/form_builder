import connectDB from "@/lib/db";
import { Form } from "@/models/Form";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import PublicFormRenderer from "@/components/PublicFormRenderer";

export default async function PublicFormPage({ params }: { params: { slug: string } }) {
  await connectDB();
  const form = await Form.findOne({ slug: params.slug });

  if (!form) {
    notFound();
  }

  // A basic render of the fields for demonstration
  return (
    <div className="min-h-screen bg-muted/40 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="border-t-8 shadow-md" style={{ borderTopColor: form.settings.themeColor || '#3b82f6' }}>
          <CardHeader>
            <CardTitle className="text-3xl font-extrabold">{form.title}</CardTitle>
            {form.description && <CardDescription className="text-base">{form.description}</CardDescription>}
          </CardHeader>
        </Card>
        
        <PublicFormRenderer form={JSON.parse(JSON.stringify(form))} />
      </div>
    </div>
  );
}
