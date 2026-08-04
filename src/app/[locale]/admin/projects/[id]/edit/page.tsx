"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateProject } from "@/app/actions/projects";
import { createClient } from '@/lib/supabase/client';
import { X, Image as ImageIcon, UploadCloud } from 'lucide-react';
import Image from 'next/image';

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [id, setId] = useState<string>("");
  const [project, setProject] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [featuredImage, setFeaturedImage] = useState<string>("");
  const [achievements, setAchievements] = useState<string[]>([]);
  
  const supabase = createClient();

  useEffect(() => {
    params.then(p => {
      setId(p.id);
      fetchProject(p.id);
    });
  }, [params]);

  const fetchProject = async (projectId: string) => {
    try {
      const { data, error } = await supabase.from('projects').select('*').eq('id', projectId).single();
      if (error) throw error;
      if (data) {
        setProject(data);
        setImages(data.images || []);
        setFeaturedImage(data.featured_image || "");
        setAchievements(data.achievements || []);
      }
    } catch (err) {
      toast.error("Failed to fetch project details");
    } finally {
      setFetching(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setLoading(true);
    
    try {
      const newImages = [...images];
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage.from('project_media').upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from('project_media').getPublicUrl(filePath);
        newImages.push(publicUrl);
      }
      setImages(newImages);
      toast.success("Images uploaded successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload images");
    } finally {
      setLoading(false);
    }
  };

  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setLoading(true);
    
    try {
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `featured_${fileName}`;

      const { error: uploadError } = await supabase.storage.from('project_media').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('project_media').getPublicUrl(filePath);
      setFeaturedImage(publicUrl);
      toast.success("Featured Image uploaded successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload featured image");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    formData.append('images', JSON.stringify(images));
    formData.append('achievements', JSON.stringify(achievements.filter(a => a.trim() !== '')));

    try {
      await updateProject(id, formData);
      toast.success("Project updated successfully!");
      router.push("/admin/projects");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-8 text-center text-zinc-500">Loading project data...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        Edit Project
      </h2>
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title *</label>
                <Input name="title" defaultValue={project?.title || ""} placeholder="Project title..." required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea 
                  name="description" 
                  defaultValue={project?.description || ""}
                  className="flex min-h-[120px] w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300" 
                  placeholder="Project description..." 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status *</label>
                <select name="status" defaultValue={project?.status || "Active"} className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus:ring-zinc-300" required>
                  <option value="Active">Active / Ongoing</option>
                  <option value="Completed">Completed</option>
                  <option value="Upcoming">Upcoming</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input name="location" defaultValue={project?.location || ""} placeholder="e.g. Rupandehi" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Partner Organization</label>
                <Input name="partner" defaultValue={project?.partner || ""} placeholder="e.g. Stromme Foundation" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Duration</label>
                <Input name="duration" defaultValue={project?.duration || ""} placeholder="e.g. 2024-Present" />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <label className="text-sm font-medium">Featured Image</label>
                <input type="hidden" name="featured_image" value={featuredImage} />
                <div className="flex items-center gap-4">
                  {featuredImage ? (
                    <div className="relative w-32 h-24 rounded-md overflow-hidden bg-zinc-100 border group">
                      <Image src={featuredImage} alt="Featured" fill className="object-cover" />
                      <button type="button" onClick={() => setFeaturedImage("")} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-32 h-24 rounded-md border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400">
                      <ImageIcon className="h-6 w-6" />
                    </div>
                  )}
                  <label className="cursor-pointer bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center gap-2">
                    <UploadCloud className="h-4 w-4" />
                    <span>Upload Main Image</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFeaturedImageUpload} disabled={loading} />
                  </label>
                </div>
                <p className="text-xs text-zinc-500">Main image shown on the project card.</p>
              </div>
              
              <div className="space-y-2 pt-4">
                <label className="text-sm font-medium">Project Gallery Images</label>
                <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg p-6 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <ImageIcon className="h-8 w-8 text-zinc-400" />
                    <p className="text-sm text-zinc-500">Select multiple images to upload</p>
                    <label className="cursor-pointer bg-zinc-900 text-white px-4 py-2 rounded-md hover:bg-zinc-800 transition-colors">
                      <span>Browse Files</span>
                      <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={loading} />
                    </label>
                  </div>
                </div>
                
                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {images.map((img, i) => (
                      <div key={i} className="relative aspect-video rounded-md overflow-hidden bg-zinc-100 border group">
                        <Image src={img} alt="Gallery" fill className="object-cover" />
                        <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full mt-6 text-white font-bold bg-zinc-900 hover:bg-zinc-800">
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
