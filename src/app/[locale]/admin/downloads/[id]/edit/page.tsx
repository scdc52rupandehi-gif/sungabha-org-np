"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateDownload } from "@/app/actions/downloads";
import { createClient } from '@/lib/supabase/client';

export default function EditDownloadPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [id, setId] = useState<string>("");
  const [doc, setDoc] = useState<any>(null);

  useEffect(() => {
    params.then(p => {
      setId(p.id);
      fetchDoc(p.id);
    });
  }, [params]);

  const fetchDoc = async (docId: string) => {
    const supabase = createClient();
    const { data } = await supabase.from('documents').select('*').eq('id', docId).single();
    if (data) {
      setDoc(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const file = formData.get('file') as File;
    if (file && file.size > 4 * 1024 * 1024) {
      toast.error("File is too large! Maximum allowed size is 4MB.");
      setLoading(false);
      return;
    }

    try {
      const result = await updateDownload(id, formData);
      if (result && !result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Download updated successfully!");
      router.push("/admin/downloads");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!doc) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        Edit Download
      </h2>
      <Card>
        <CardHeader>
          <CardTitle>Download Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input name="title" defaultValue={doc.title} placeholder="Enter title..." required />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select name="category" defaultValue={doc.category} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" required>
                <option value="Publication">Publication</option>
                <option value="Annual Report">Annual Report</option>
                <option value="Audit Report">Audit Report</option>
                <option value="General">General</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Published Year (Optional)</label>
              <Input name="published_year" defaultValue={doc.published_year} type="number" placeholder="e.g. 2024" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Attach PDF (Leave empty to keep existing)</label>
              {doc.file_url && (
                <div className="text-sm mb-2 text-muted-foreground flex items-center gap-2">
                  <span>Current File:</span>
                  <a href={doc.file_url} target="_blank" rel="noreferrer" className="text-brand-blue hover:underline">
                    View PDF
                  </a>
                </div>
              )}
              <Input name="file" type="file" accept=".pdf" />
              <input type="hidden" name="existing_file_url" value={doc.file_url || ''} />
            </div>
            
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Saving..." : "Update Download"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
