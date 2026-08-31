"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateNews } from "@/app/actions/news";
import { createClient } from '@/lib/supabase/client';

export default function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [id, setId] = useState<string>("");
  const [news, setNews] = useState<any>(null);

  useEffect(() => {
    params.then(p => {
      setId(p.id);
      fetchNews(p.id);
    });
  }, [params]);

  const fetchNews = async (newsId: string) => {
    const supabase = createClient();
    const { data } = await supabase.from('news_events').select('*').eq('id', newsId).single();
    if (data) {
      setNews(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await updateNews(id, formData);
      toast.success("News updated successfully!");
      router.push("/admin/news");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!news) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        Edit News
      </h2>
      <Card>
        <CardHeader>
          <CardTitle>News Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input name="title" defaultValue={news.title} placeholder="Enter title..." required />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea 
                name="content" 
                defaultValue={news.content || ''}
                className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter description..." 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Attach PDF (Leave empty to keep existing)</label>
              {news.attached_file_url && (
                <div className="text-sm mb-2 text-muted-foreground flex items-center gap-2">
                  <span>Current File:</span>
                  <a href={news.attached_file_url} target="_blank" rel="noreferrer" className="text-brand-blue hover:underline">
                    View PDF
                  </a>
                </div>
              )}
              <Input name="attached_file" type="file" accept=".pdf" />
              <input type="hidden" name="existing_file_url" value={news.attached_file_url || ''} />
            </div>
            
            <div className="flex items-center gap-2">
              <input type="checkbox" name="is_published" id="is_published" value="true" defaultChecked={news.is_published !== false} />
              <label htmlFor="is_published" className="text-sm font-medium">Publish immediately</label>
            </div>
            
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Saving..." : "Update News"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
