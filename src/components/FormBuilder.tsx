"use client";

import { useState } from "react";
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Save, 
  Eye, 
  Settings2, 
  Type, 
  AtSign, 
  Phone, 
  CreditCard, 
  ListTodo,
  Sparkles,
  ChevronRight,
  Layers,
  Palette
} from "lucide-react";
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors 
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// --- Draggable Field Component ---
function SortableField({ field, onRemove, onLabelChange }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <Card ref={setNodeRef} style={style} className="group relative bg-white border-slate-200 p-5 mb-4 hover:border-blue-400 hover:shadow-md transition-all">
      <div className="flex items-center gap-4">
        <div {...attributes} {...listeners} className="cursor-grab text-slate-300 hover:text-slate-500">
          <GripVertical className="h-5 w-5" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest font-bold text-blue-500">{field.type}</span>
            <Button variant="ghost" size="icon" onClick={() => onRemove(field.id)} className="h-7 w-7 text-slate-300 hover:text-destructive hover:bg-destructive/5 opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <Input 
            value={field.label} 
            onChange={(e) => onLabelChange(field.id, e.target.value)}
            className="border-none p-0 text-base font-medium focus-visible:ring-0 placeholder:text-slate-400"
            placeholder="Question Label..."
          />
          <div className="h-10 w-full bg-slate-50 rounded border border-dashed border-slate-200 flex items-center px-3 italic text-sm text-slate-400">
            User response will appear here...
          </div>
        </div>
      </div>
    </Card>
  );
}

// --- Main Builder UI ---
export default function ProFormBuilder() {
  const [fields, setFields] = useState<any[]>([]);
  const [title, setTitle] = useState("Untitled High-Conversion Form");
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const addField = (type: string) => {
    const newField = { 
      id: Math.random().toString(36).substr(2, 9), 
      type, 
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false 
    };
    setFields([...fields, newField]);
    toast.info(`${type.toUpperCase()} field added`);
  };

  const removeField = (id: string) => setFields(fields.filter(f => f.id !== id));

  const onLabelChange = (id: string, label: string) => {
    setFields(fields.map(f => f.id === id ? { ...f, label } : f));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const saveForm = async () => {
    if (fields.length === 0) return toast.error("Add at least one field!");
    setIsSaving(true);
    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, fields }),
      });
      if (res.ok) {
        toast.success("Form Published Successfully! 🚀");
        router.push("/dashboard/forms");
      }
    } catch (err) {
      toast.error("Failed to publish form");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Sidebar Tools */}
      <aside className="w-80 border-r bg-white flex flex-col p-6 shadow-sm z-20">
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">Design Studio</span>
        </div>

        <Tabs defaultValue="fields" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="fields"><Layers className="h-4 w-4 mr-2" /> Elements</TabsTrigger>
            <TabsTrigger value="style"><Palette className="h-4 w-4 mr-2" /> Theme</TabsTrigger>
          </TabsList>
          
          <TabsContent value="fields" className="space-y-6">
            <div className="space-y-3">
              <Label className="text-xs uppercase font-bold text-slate-400 tracking-wider">Basic Inputs</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => addField('text')} className="justify-start border-slate-100 hover:border-blue-200">
                  <Type className="h-4 w-4 mr-2 text-blue-500" /> Text
                </Button>
                <Button variant="outline" size="sm" onClick={() => addField('email')} className="justify-start border-slate-100 hover:border-blue-200">
                  <AtSign className="h-4 w-4 mr-2 text-purple-500" /> Email
                </Button>
                <Button variant="outline" size="sm" onClick={() => addField('number')} className="justify-start border-slate-100 hover:border-blue-200">
                  <Phone className="h-4 w-4 mr-2 text-green-500" /> Phone
                </Button>
                <Button variant="outline" size="sm" onClick={() => addField('payment')} className="justify-start border-slate-100 hover:border-blue-200">
                  <CreditCard className="h-4 w-4 mr-2 text-amber-500" /> Payment
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs uppercase font-bold text-slate-400 tracking-wider">Conversion Boosters</Label>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-between group border-slate-100 hover:border-blue-200">
                  <div className="flex items-center"><ListTodo className="h-4 w-4 mr-2 text-blue-500" /> Multiple Choice</div>
                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                </Button>
                <Button variant="outline" className="w-full justify-between group border-slate-100 hover:border-blue-200">
                  <div className="flex items-center"><Plus className="h-4 w-4 mr-2 text-blue-500" /> Dynamic File Upload</div>
                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="style" className="p-4 text-center py-12 border-2 border-dashed rounded-xl">
             <Settings2 className="h-8 w-8 mx-auto text-slate-300 mb-2" />
             <p className="text-sm text-slate-400 font-medium">Theme engine is coming soon in 10x update.</p>
          </TabsContent>
        </Tabs>

        <div className="mt-auto pt-6 border-t">
          <Button onClick={saveForm} disabled={isSaving} className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-white shadow-lg shadow-blue-500/20">
            {isSaving ? "Publishing..." : "Launch Form 🚀"}
          </Button>
        </div>
      </aside>

      {/* Builder Canvas */}
      <main className="flex-1 overflow-y-auto p-12">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="space-y-4 text-center mb-12">
            <Input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="text-4xl font-extrabold text-slate-900 border-none bg-transparent p-0 text-center focus-visible:ring-0 h-auto"
              placeholder="Give your form a killer title..."
            />
            <p className="text-slate-400 font-medium tracking-wide">Drag and drop elements to build your storyboard.</p>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
              {fields.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-24 text-center">
                  <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Plus className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Your canvas is empty</h3>
                  <p className="text-slate-400 max-w-xs mx-auto mt-2">Click elements from the sidebar to start building your high-conversion form.</p>
                </div>
              ) : (
                fields.map((field) => (
                  <SortableField 
                    key={field.id} 
                    field={field} 
                    onRemove={removeField} 
                    onLabelChange={onLabelChange} 
                  />
                ))
              )}
            </SortableContext>
          </DndContext>
        </div>
      </main>

      {/* Right Preview Toggle */}
      <aside className="w-20 border-l bg-white flex flex-col items-center py-6 gap-6 shadow-sm z-20">
        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-blue-50 hover:text-blue-600">
          <Eye className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-blue-50 hover:text-blue-600">
          <Settings2 className="h-6 w-6" />
        </Button>
      </aside>
    </div>
  );
}
