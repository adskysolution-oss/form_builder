import connectDB from "@/lib/db";
import { Form } from "@/models/Form";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

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
        
        {/* We would typically use a client component wrapper here to handle form submission state */}
        <form className="space-y-6">
          {form.fields.map((field: any) => (
            <Card key={field.id} className="shadow-sm">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Label className="text-base font-semibold">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  
                  {field.type === 'TEXT' && (
                    <Input placeholder={field.placeholder || "Your answer"} required={field.required} />
                  )}
                  {field.type === 'EMAIL' && (
                    <Input type="email" placeholder={field.placeholder || "Your email"} required={field.required} />
                  )}
                  {field.type === 'PHONE' && (
                    <Input type="tel" placeholder={field.placeholder || "Your phone number"} required={field.required} />
                  )}
                  {/* Basic fallback for complex fields for now */}
                  {['DROPDOWN', 'CHECKBOX', 'FILE', 'PAYMENT'].includes(field.type) && (
                    <div className="text-sm text-muted-foreground italic border border-dashed p-4 rounded bg-muted/20">
                      [{field.type}] field rendering placeholder
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          
          <div className="flex justify-between items-center pt-4">
            <Button size="lg" type="submit" style={{ backgroundColor: form.settings.themeColor || '#3b82f6' }}>
              {form.settings.submitText || "Submit"}
            </Button>
            <div className="text-xs text-muted-foreground">
              Powered by <span className="font-bold">SmartForm</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
