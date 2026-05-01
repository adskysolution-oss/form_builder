"use client";

import { useState } from "react";
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { GripVertical, Type, Mail, Phone, ChevronDown, CheckSquare, FileUp, CreditCard, Trash2 } from "lucide-react";

export type FieldType = 'TEXT' | 'EMAIL' | 'PHONE' | 'DROPDOWN' | 'CHECKBOX' | 'FILE' | 'PAYMENT';

export interface FormFieldData {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  placeholder?: string;
}

const FIELD_TYPES: { type: FieldType; icon: React.ElementType; label: string }[] = [
  { type: 'TEXT', icon: Type, label: 'Short Text' },
  { type: 'EMAIL', icon: Mail, label: 'Email' },
  { type: 'PHONE', icon: Phone, label: 'Phone' },
  { type: 'DROPDOWN', icon: ChevronDown, label: 'Dropdown' },
  { type: 'CHECKBOX', icon: CheckSquare, label: 'Checkbox' },
  { type: 'FILE', icon: FileUp, label: 'File Upload' },
  { type: 'PAYMENT', icon: CreditCard, label: 'Payment Button' },
];

function SortableFieldItem({ 
  field, 
  onRemove, 
  onChange 
}: { 
  field: FormFieldData; 
  onRemove: (id: string) => void;
  onChange: (id: string, updates: Partial<FormFieldData>) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-background border rounded-lg p-4 mb-4 shadow-sm flex gap-4 group">
      <div 
        {...attributes} 
        {...listeners}
        className="mt-2 cursor-grab text-muted-foreground hover:text-foreground"
      >
        <GripVertical className="h-5 w-5" />
      </div>
      
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-1 bg-muted rounded">{field.type}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onRemove(field.id)} className="text-destructive h-8 w-8">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Field Label</Label>
            <Input 
              value={field.label} 
              onChange={(e) => onChange(field.id, { label: e.target.value })} 
              placeholder="Question text..." 
            />
          </div>
          <div className="space-y-2">
            <Label>Placeholder Text</Label>
            <Input 
              value={field.placeholder || ''} 
              onChange={(e) => onChange(field.id, { placeholder: e.target.value })} 
              placeholder="Optional placeholder..." 
              disabled={['FILE', 'PAYMENT', 'CHECKBOX'].includes(field.type)}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-2 border-t mt-4">
          <Switch 
            id={`req-${field.id}`} 
            checked={field.required}
            onCheckedChange={(c) => onChange(field.id, { required: c })}
          />
          <Label htmlFor={`req-${field.id}`} className="text-sm">Required Field</Label>
        </div>
      </div>
    </div>
  );
}

export default function FormBuilder() {
  const [fields, setFields] = useState<FormFieldData[]>([]);
  const [formTitle, setFormTitle] = useState("Untitled Form");
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addField = (type: FieldType) => {
    const newField: FormFieldData = {
      id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      label: `New ${type.toLowerCase()} field`,
      required: false,
    };
    setFields([...fields, newField]);
  };

  const updateField = (id: string, updates: Partial<FormFieldData>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const handleSaveForm = async () => {
    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle,
          fields: fields,
          settings: {
            themeColor: "#3b82f6",
            submitText: "Submit",
            successMessage: "Thank you! Your response has been recorded.",
            isPublished: true
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        alert(`Form saved successfully! Public URL: /form/${data.form.slug}`);
      } else {
        const data = await res.json();
        alert(`Failed to save form: ${data.error}`);
      }
    } catch (err) {
      alert("An error occurred while saving the form.");
    }
  };

  return (
    <div className="grid md:grid-cols-[300px_1fr] gap-8">
      {/* Sidebar Tools */}
      <div className="space-y-6">
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Form Details</h3>
            <div className="space-y-2">
              <Label>Form Title</Label>
              <Input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
            </div>
            
            <h3 className="font-semibold mt-6 mb-4 text-sm uppercase tracking-wider text-muted-foreground">Add Fields</h3>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
              {FIELD_TYPES.map((ft) => {
                const Icon = ft.icon;
                return (
                  <Button 
                    key={ft.type} 
                    variant="outline" 
                    className="justify-start w-full gap-3"
                    onClick={() => addField(ft.type)}
                  >
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    {ft.label}
                  </Button>
                );
              })}
            </div>

            <div className="pt-6 border-t mt-6">
              <Button className="w-full" onClick={handleSaveForm}>Save Form</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Canvas */}
      <div className="bg-muted/30 rounded-xl p-4 min-h-[600px] border border-dashed border-border/60">
        {fields.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-60">
            <Type className="h-12 w-12 mb-4" />
            <p>Your form is empty.</p>
            <p className="text-sm">Click a field type on the left to get started.</p>
          </div>
        ) : (
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={fields.map(f => f.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4 max-w-2xl mx-auto">
                {fields.map((field) => (
                  <SortableFieldItem 
                    key={field.id} 
                    field={field} 
                    onRemove={removeField}
                    onChange={updateField}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}
