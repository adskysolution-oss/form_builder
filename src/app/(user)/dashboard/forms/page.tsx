"use client";

import { useState, useEffect } from "react";
import { Plus, Copy, MoreVertical, FileText, Eye, Trash2, BarChart3, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { toast } from "sonner";

export default function FormsPage() {
  const [forms, setForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const res = await fetch("/api/forms");
      const data = await res.json();
      setForms(data.forms || []);
    } catch (err) {
      console.error("Failed to fetch forms");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (slug: string) => {
    const url = `${window.location.origin}/form/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Public URL copied to clipboard!");
  };

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Your SmartForms</h2>
          <p className="text-muted-foreground">Manage, analyze, and build 10x high-converting forms.</p>
        </div>
        <Link href="/dashboard/forms/builder">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 px-6">
            <Plus className="mr-2 h-4 w-4" /> Create New Form
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-xl border border-slate-200" />
          ))}
        </div>
      ) : forms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl">
          <div className="bg-white p-6 rounded-full shadow-sm mb-4">
            <FileText className="h-12 w-12 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800">No forms found</h3>
          <p className="text-slate-500 mb-6">Start building your first 10x conversion form today.</p>
          <Link href="/dashboard/forms/builder">
            <Button variant="outline" className="px-8">Create your first form</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <Card key={form._id} className="group overflow-hidden border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300 bg-white">
              <CardHeader className="pb-3 border-b border-slate-50">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {form.title}
                    </CardTitle>
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-none font-medium">
                      {form.fields?.length || 0} Fields
                    </Badge>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem className="cursor-pointer">
                        <Eye className="mr-2 h-4 w-4" /> Preview Form
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer text-blue-600">
                        <BarChart3 className="mr-2 h-4 w-4" /> View Analytics
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Form
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center gap-6 text-sm text-slate-500">
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-1">Submissions</span>
                    <span className="text-lg font-bold text-slate-800">450</span>
                  </div>
                  <div className="flex flex-col border-l border-slate-100 pl-6">
                    <span className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-1">Conversion</span>
                    <span className="text-lg font-bold text-blue-600">12.4%</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50/50 gap-2 border-t border-slate-100 pt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 bg-white hover:bg-slate-50 text-slate-600"
                  onClick={() => copyToClipboard(form.slug)}
                >
                  <Copy className="mr-2 h-3 w-3" /> URL
                </Button>
                <Link href={`/form/${form.slug}`} target="_blank" className="flex-1">
                  <Button size="sm" className="w-full bg-slate-800 hover:bg-slate-900 text-white">
                    <Globe className="mr-2 h-3 w-3" /> View Live
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
