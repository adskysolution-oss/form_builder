import FormBuilder from "@/components/FormBuilder";

export default function FormBuilderPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Form Builder</h1>
          <p className="text-muted-foreground">Drag and drop fields to create your custom form.</p>
        </div>
      </div>
      
      <FormBuilder />
    </div>
  );
}
