"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from "sonner";
import { getGalleryImages, getGalleryVideos, deleteGalleryImage, deleteGalleryVideo } from "@/app/actions/gallery";
import Image from 'next/image';

export default function GalleryListPage() {
  const [images, setImages] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'images' | 'videos'>('images');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [imgData, vidData] = await Promise.all([getGalleryImages(), getGalleryVideos()]);
      setImages(imgData);
      setVideos(vidData);
    } catch (error) {
      toast.error("Failed to load gallery");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (id: string) => {
    if(confirm("Delete this image?")) {
      await deleteGalleryImage(id);
      toast.success("Image deleted");
      fetchData();
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if(confirm("Delete this video?")) {
      await deleteGalleryVideo(id);
      toast.success("Video deleted");
      fetchData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Gallery Management</h2>
          <p className="text-zinc-500">Manage photos and YouTube videos.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/gallery/images/create">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="mr-2 h-4 w-4" /> Add Image
            </Button>
          </Link>
          <Link href="/admin/gallery/videos/create">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> Add Video
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex gap-4 border-b">
        <button 
          onClick={() => setTab('images')}
          className={`pb-2 px-4 font-medium transition-colors ${tab === 'images' ? 'border-b-2 border-brand-blue text-brand-blue' : 'text-zinc-500 hover:text-zinc-700'}`}
        >
          Photos ({images.length})
        </button>
        <button 
          onClick={() => setTab('videos')}
          className={`pb-2 px-4 font-medium transition-colors ${tab === 'videos' ? 'border-b-2 border-brand-blue text-brand-blue' : 'text-zinc-500 hover:text-zinc-700'}`}
        >
          Videos ({videos.length})
        </button>
      </div>

      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div className="text-center py-8 text-zinc-500">Loading media...</div>
          ) : tab === 'images' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map(img => (
                <div key={img.id} className="group relative rounded-xl overflow-hidden border">
                  <div className="aspect-square relative bg-muted">
                    <Image src={img.image_url} alt={img.title} fill className="object-cover" />
                  </div>
                  <div className="p-3 bg-card border-t">
                    <p className="font-semibold text-sm truncate">{img.title}</p>
                  </div>
                  <button onClick={() => handleDeleteImage(img.id)} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {images.length === 0 && <p className="col-span-full text-center py-8 text-zinc-500">No images uploaded yet.</p>}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map(vid => (
                <div key={vid.id} className="group relative rounded-xl overflow-hidden border bg-card p-4">
                  <div className="aspect-video relative rounded-lg overflow-hidden bg-muted mb-3">
                    <iframe src={vid.video_url} className="w-full h-full" allowFullScreen></iframe>
                  </div>
                  <p className="font-semibold">{vid.title}</p>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteVideo(vid.id)} className="w-full mt-3">
                    <Trash2 className="w-4 h-4 mr-2" /> Delete Video
                  </Button>
                </div>
              ))}
              {videos.length === 0 && <p className="col-span-full text-center py-8 text-zinc-500">No videos added yet.</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
