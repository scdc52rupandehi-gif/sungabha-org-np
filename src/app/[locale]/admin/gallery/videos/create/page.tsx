"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createGalleryVideo } from "@/app/actions/gallery";
import Link from 'next/link';

export default function CreateVideoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createGalleryVideo(formData);
      toast.success("Video added to gallery!");
      router.push("/admin/gallery");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Add Video
        </h2>
        <Link href="/admin/gallery">
          <Button variant="outline">Cancel</Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Video Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input name="title" placeholder="Documentary" required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">YouTube Embed URL</label>
              <Input name="video_url" placeholder="https://www.youtube.com/embed/..." required />
              <p className="text-xs text-muted-foreground">Use the YouTube Embed URL (e.g. https://www.youtube.com/embed/dQw4w9WgXcQ).</p>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={loading} className="bg-brand-blue hover:bg-brand-blue/90">
                {loading ? "Adding..." : "Add to Gallery"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
