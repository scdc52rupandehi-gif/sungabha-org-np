"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createNews } from "@/app/actions/news";


export default function CreateNewsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    // Check file size limit (4MB)
    const file = formData.get('attached_file') as File;
    if (file && file.size > 4 * 1024 * 1024) {
      toast.error("File is too large! Maximum allowed size is 4MB.");
      setLoading(false);
      return;
    }

    try {
      const result = await createNews(formData);
      if (result && !result.success) {
        toast.error(result.error);
      } else {
        toast.success("News created successfully!");
        router.push("/admin/news");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        Create News
      </h2>
      <Card>
        <CardHeader>
          <CardTitle>News Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <select 
                name="type" 
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                required
                defaultValue="News"
              >
                <option value="News" className="text-zinc-900">News</option>
                <option value="Event" className="text-zinc-900">Event</option>
                <option value="Notice" className="text-zinc-900">Notice</option>
                <option value="Tender" className="text-zinc-900">Tender</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input name="title" placeholder="Enter title..." required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea 
                name="content" 
                className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter description..." 
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Attach PDF (Optional, Max 4MB)</label>
              <Input name="attached_file" type="file" accept=".pdf" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="is_published" id="is_published" value="true" defaultChecked />
              <label htmlFor="is_published" className="text-sm font-medium">Publish immediately</label>
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Saving..." : "Save News"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
