"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, Image as ImageIcon, Trash2, Copy, FileText, Video } from "lucide-react";
import { toast } from "sonner";
import { deleteMediaFile } from "@/app/actions/media";
import { DeleteDialog } from "@/components/ui/delete-dialog";

export default function MediaLibraryPage() {
  const supabase = createClient();
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletePath, setDeletePath] = useState<string | null>(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const { data, error } = await supabase.storage.from("media").list();
      if (error) throw error;
      // Filter out system files like .emptyFolderPlaceholder
      setFiles((data || []).filter(f => f.name !== ".emptyFolderPlaceholder"));
    } catch (error) {
      toast.error("Failed to load media files");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);

    try {
      for (const file of Array.from(e.target.files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = Math.random().toString() + '.' + fileExt;
        const { error } = await supabase.storage.from("media").upload(fileName, file);
        if (error) throw error;
      }
      toast.success("Files uploaded successfully");
      fetchFiles();
    } catch (error: any) {
      toast.error(error.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletePath) return;
    try {
      await deleteMediaFile(deletePath);
      toast.success("File deleted");
      fetchFiles();
    } catch (error) {
      toast.error("Failed to delete file");
    } finally {
      setDeletePath(null);
    }
  };

  const copyUrl = (fileName: string) => {
    const { data } = supabase.storage.from("media").getPublicUrl(fileName);
    navigator.clipboard.writeText(data.publicUrl);
    toast.success("URL copied to clipboard");
  };

  const getFileIcon = (mimetype: string) => {
    if (!mimetype) return <FileText size={40} className="text-zinc-400" />;
    if (mimetype.startsWith("image/")) return <ImageIcon size={40} className="text-zinc-400" />;
    if (mimetype.startsWith("video/")) return <Video size={40} className="text-zinc-400" />;
    return <FileText size={40} className="text-zinc-400" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Media Library</h2>
        <div className="relative">
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2">
            <UploadCloud size={18} /> {uploading ? "Uploading..." : "Upload Files"}
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <p className="text-center py-8 text-zinc-500">Loading media...</p>
          ) : files.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg">
              <UploadCloud size={48} className="mx-auto text-zinc-400 mb-4" />
              <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">No media files found</h3>
              <p className="text-sm text-zinc-500 mt-1">Drag and drop or click upload to add files</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {files.map((file) => {
                const publicUrl = supabase.storage.from("media").getPublicUrl(file.name).data.publicUrl;
                return (
                  <div key={file.id} className="relative group rounded-md border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-zinc-50 dark:bg-zinc-900/50 aspect-square flex flex-col items-center justify-center">
                    {file.metadata?.mimetype?.startsWith("image/") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={publicUrl} alt={file.name} className="object-cover w-full h-full" />
                    ) : (
                      getFileIcon(file.metadata?.mimetype)
                    )}
                    
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => copyUrl(file.name)}>
                        <Copy size={14} />
                      </Button>
                      <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => setDeletePath(file.name)}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                    <div className="absolute bottom-0 inset-x-0 bg-black/80 px-2 py-1 text-xs text-white truncate text-center">
                      {file.name}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <DeleteDialog 
        isOpen={!!deletePath}
        onClose={() => setDeletePath(null)}
        onConfirm={handleDelete}
        title="Delete Media File"
      />
    </div>
  );
}
