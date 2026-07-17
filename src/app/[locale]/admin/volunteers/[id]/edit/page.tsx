"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateVolunteer } from "@/app/actions/volunteers";
import { createClient } from '@/lib/supabase/client';

export default function EditVolunteerPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [id, setId] = useState<string>("");
  useEffect(() => {
    params.then(p => setId(p.id));
  }, [params]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await updateVolunteer(id, formData);
      toast.success("Volunteer updated successfully!");
      router.push("/admin/volunteers");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        Edit Volunteer
      </h2>
      <Card>
        <CardHeader>
          <CardTitle>Volunteer Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title / Name</label>
              <Input name="title" placeholder="Enter title or name..." required />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Saving..." : "Save Volunteer"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
