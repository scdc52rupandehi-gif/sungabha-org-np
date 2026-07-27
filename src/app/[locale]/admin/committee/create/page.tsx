"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createCommittee } from "@/app/actions/committee";
import { toast } from "sonner";

export default function CreateCommitteePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      await createCommittee(formData);
      toast.success("Committee member created successfully");
      router.push('/admin/committee');
    } catch (error: any) {
      toast.error(error.message || "Failed to create committee member");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/committee">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Add Committee Member</h2>
          <p className="text-sm text-zinc-500">Create a new executive committee profile</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input name="name" required placeholder="e.g. Amrita Thapa" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Input name="role" required placeholder="e.g. Chairperson" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Experience</label>
                <Input name="experience" required placeholder="e.g. 15 Years" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tenure</label>
                <Input name="tenure" required placeholder="e.g. 29-01-2025 to 29-01-2027" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Profile Image</label>
                <Input type="file" name="image" accept="image/png, image/jpeg, image/jpg, image/webp" />
                <p className="text-xs text-zinc-500">Upload a JPG or PNG image.</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Order Index</label>
                <Input type="number" name="order_index" defaultValue="0" />
                <p className="text-xs text-zinc-500">Lower numbers appear first on the page (e.g. 1 for Chairperson).</p>
              </div>
            </div>

            <div className="flex justify-end gap-4 border-t pt-4">
              <Link href="/admin/committee">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" disabled={loading} className="bg-brand-blue hover:bg-brand-blue/90">
                {loading ? "Creating..." : "Create Member"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
