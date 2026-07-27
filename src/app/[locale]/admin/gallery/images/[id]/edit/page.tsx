"use client";
import React, { useState, useEffect, use } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getGalleryImageById, updateGalleryImage } from "@/app/actions/gallery";
import Link from 'next/link';
import Image from 'next/image';

export default function EditImagePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<any>(null);

  const resolvedParams = use(params);
  const id = resolvedParams.id;

  useEffect(() => {
    loadImage();
  }, [id]);

  const loadImage = async () => {
    try {
      const data = await getGalleryImageById(id);
      setImage(data);
    } catch (error) {
      toast.error("Failed to load image details");
      router.push('/admin/gallery');
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await updateGalleryImage(id, formData);
      toast.success("Image updated successfully!");
      router.push("/admin/gallery");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
      setLoading(false);
    }
  };

  if (!image) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Edit Photo
        </h2>
        <Link href="/admin/gallery">
          <Button variant="outline">Cancel</Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Image Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input type="hidden" name="existing_image_url" value={image.image_url || ''} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title (English)</label>
                <Input name="title" defaultValue={image.title} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Title (Nepali)</label>
                <Input name="title_ne" defaultValue={image.title_ne} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Image File</label>
              {image.image_url && (
                <div className="mb-2 relative w-32 h-32 rounded-xl overflow-hidden border">
                  <Image src={image.image_url} alt={image.title} fill className="object-cover" />
                </div>
              )}
              <Input type="file" name="image" accept="image/png, image/jpeg, image/jpg, image/webp" />
              <p className="text-xs text-muted-foreground">Leave empty to keep the existing image.</p>
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
