"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createStaff } from "@/app/actions/staff";
import Link from 'next/link';

export default function CreateStaffPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createStaff(formData);
      toast.success("Staff member created successfully!");
      router.push("/admin/staff");
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
          Create Staff Member
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
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input name="name" placeholder="John Doe" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Position</label>
                <Input name="position" placeholder="Executive Director" required />
              </div>
            </div>

            <div className="space-y-4 mt-6 pt-6 border-t">
              <div className="space-y-2">
                <label className="text-sm font-medium">Profile Image</label>
                <Input name="image" type="file" accept="image/jpeg, image/png, image/webp" />
                <p className="text-xs text-muted-foreground">Upload a JPG or PNG image.</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Order Index</label>
                <Input name="order_index" type="number" defaultValue="0" />
                <p className="text-xs text-muted-foreground">Lower numbers appear first on the page (e.g. 1 for Executive Director).</p>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={loading} className="bg-brand-blue hover:bg-brand-blue/90">
                {loading ? "Creating..." : "Create Staff Member"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
