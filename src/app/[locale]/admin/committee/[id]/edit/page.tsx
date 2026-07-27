"use client";

import React, { useEffect, useState, use } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getCommitteeById, updateCommittee } from "@/app/actions/committee";
import { toast } from "sonner";
import Image from "next/image";

export default function EditCommitteePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [member, setMember] = useState<any>(null);

  const resolvedParams = use(params);
  const id = resolvedParams.id;

  useEffect(() => {
    loadMember();
  }, [id]);

  const loadMember = async () => {
    try {
      const data = await getCommitteeById(id);
      setMember(data);
    } catch (error) {
      toast.error("Failed to load committee member details");
      router.push('/admin/committee');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      await updateCommittee(id, formData);
      toast.success("Committee member updated successfully");
      router.push('/admin/committee');
    } catch (error: any) {
      toast.error(error.message || "Failed to update committee member");
      setLoading(false);
    }
  };

  if (!member) {
    return <div className="p-8 text-center text-zinc-500">Loading...</div>;
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/committee">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Edit Committee Member</h2>
          <p className="text-sm text-zinc-500">Update the executive committee profile</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <input type="hidden" name="existing_image_url" value={member.image_url || ''} />
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input name="name" required defaultValue={member.name} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Input name="role" required defaultValue={member.role} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Experience</label>
                <Input name="experience" required defaultValue={member.experience} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tenure</label>
                <Input name="tenure" required defaultValue={member.tenure} />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Profile Image</label>
                {member.image_url && (
                  <div className="mb-2 relative w-20 h-20 rounded-full overflow-hidden border">
                    <Image src={member.image_url} alt={member.name} fill className="object-cover" />
                  </div>
                )}
                <Input type="file" name="image" accept="image/png, image/jpeg, image/jpg, image/webp" />
                <p className="text-xs text-zinc-500">Leave empty to keep the existing image. Upload a new JPG or PNG to replace it.</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Order Index</label>
                <Input type="number" name="order_index" defaultValue={member.order_index} />
                <p className="text-xs text-zinc-500">Lower numbers appear first on the page (e.g. 1 for Chairperson).</p>
              </div>
            </div>

            <div className="flex justify-end gap-4 border-t pt-4">
              <Link href="/admin/committee">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
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
