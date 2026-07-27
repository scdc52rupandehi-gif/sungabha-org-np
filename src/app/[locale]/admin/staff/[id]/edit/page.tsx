"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateStaff, getStaffById } from "@/app/actions/staff";
import Link from 'next/link';

export default function EditStaffPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [staff, setStaff] = useState<any>(null);
  
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const data = await getStaffById(params.id);
        setStaff(data);
      } catch (error) {
        toast.error("Failed to load staff member details");
        router.push("/admin/staff");
      }
    };
    fetchStaff();
  }, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await updateStaff(params.id, formData);
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">English</h3>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input name="name" defaultValue={staff.name} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Position</label>
                  <Input name="position" defaultValue={staff.position} required />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Nepali (Optional)</h3>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name (Nepali)</label>
                  <Input name="name_ne" defaultValue={staff.name_ne} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Position (Nepali)</label>
                  <Input name="position_ne" defaultValue={staff.position_ne} />
                </div>
              </div>
            </div>

            <div className="space-y-4 mt-6 pt-6 border-t">
              <div className="space-y-2">
                <label className="text-sm font-medium">Profile Image URL</label>
                <Input name="image_url" defaultValue={staff.image_url} />
                <p className="text-xs text-muted-foreground">Provide a direct link to the profile image.</p>
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
