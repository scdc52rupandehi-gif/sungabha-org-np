"use client";
import React, { useState, useEffect, use } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateStaff, getStaffById } from "@/app/actions/staff";
import Link from 'next/link';

export default function EditStaffPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [staff, setStaff] = useState<any>(null);
  
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const data = await getStaffById(id);
        setStaff(data);
      } catch (error) {
        toast.error("Failed to load staff member details");
        router.push("/admin/staff");
      }
    };
    fetchStaff();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await updateStaff(id, formData);
      toast.success("Staff member updated successfully!");
      router.push("/admin/staff");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!staff) return <div className="p-8 text-center text-zinc-500">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Edit Staff Member
        </h2>
        <Link href="/admin/staff">
          <Button variant="outline">Cancel</Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Staff Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input type="hidden" name="existing_image_url" value={staff.image_url || ''} />
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input name="name" defaultValue={staff.name} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Position</label>
                <Input name="position" defaultValue={staff.position} required />
              </div>
            </div>

            <div className="space-y-4 mt-6 pt-6 border-t">
              <div className="space-y-2">
                <label className="text-sm font-medium">Profile Image</label>
                {staff.image_url && (
                  <div className="mb-2">
                    <img src={staff.image_url} alt={staff.name} className="w-20 h-20 object-cover rounded-full border" />
                  </div>
                )}
                <Input name="image" type="file" accept="image/jpeg, image/png, image/webp" />
                <p className="text-xs text-muted-foreground">Upload a new image to replace the current one, or leave blank to keep it.</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Order Index</label>
                <Input name="order_index" type="number" defaultValue={staff.order_index} />
                <p className="text-xs text-muted-foreground">Lower numbers appear first on the page.</p>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={loading} className="bg-brand-blue hover:bg-brand-blue/90">
                {loading ? "Updating..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
