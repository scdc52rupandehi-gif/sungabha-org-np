"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createGalleryImage } from "@/app/actions/gallery";
import Link from 'next/link';

export default function CreateImagePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createGalleryImage(formData);
      toast.success("Image added to gallery!");
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
          Add Photo
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title (English)</label>
                <Input name="title" placeholder="Community Event" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Title (Nepali)</label>
                <Input name="title_ne" placeholder="सामुदायिक कार्यक्रम" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Image File(s)</label>
              <Input type="file" name="image" accept="image/png, image/jpeg, image/jpg, image/webp" multiple required />
              <p className="text-xs text-muted-foreground">Upload one or multiple JPG/PNG images. All selected images will use the title above.</p>
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
