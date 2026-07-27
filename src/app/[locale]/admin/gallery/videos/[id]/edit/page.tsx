"use client";
import React, { useState, useEffect, use } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getGalleryVideoById, updateGalleryVideo } from "@/app/actions/gallery";
import Link from 'next/link';

export default function EditVideoPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [video, setVideo] = useState<any>(null);

  const resolvedParams = use(params);
  const id = resolvedParams.id;

  useEffect(() => {
    loadVideo();
  }, [id]);

  const loadVideo = async () => {
    try {
      const data = await getGalleryVideoById(id);
      setVideo(data);
    } catch (error) {
      toast.error("Failed to load video details");
      router.push('/admin/gallery');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await updateGalleryVideo(id, formData);
      toast.success("Video updated successfully!");
      router.push("/admin/gallery");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
      setLoading(false);
    }
  };

  if (!video) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Edit Video
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title (English)</label>
                <Input name="title" defaultValue={video.title} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Title (Nepali)</label>
                <Input name="title_ne" defaultValue={video.title_ne} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">YouTube Embed URL</label>
              <Input name="video_url" defaultValue={video.video_url} required />
              <p className="text-xs text-muted-foreground">Example: https://www.youtube.com/embed/XXXXXX</p>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={loading} className="bg-brand-blue hover:bg-brand-blue/90">
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
