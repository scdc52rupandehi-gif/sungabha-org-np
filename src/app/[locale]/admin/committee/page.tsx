"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2 } from "lucide-react";
import Link from "next/link";
import { getCommittee, deleteCommittee } from "@/app/actions/committee";
import { toast } from "sonner";
import Image from "next/image";

export default function CommitteePage() {
  const [committee, setCommittee] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCommittee();
  }, []);

  const loadCommittee = async () => {
    try {
      const data = await getCommittee();
      setCommittee(data);
    } catch (error) {
      toast.error("Failed to load executive committee members");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this committee member?")) {
      try {
        await deleteCommittee(id);
        toast.success("Committee member deleted");
        loadCommittee();
      } catch (error) {
        toast.error("Failed to delete committee member");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Executive Committee</h2>
          <p className="text-zinc-500 dark:text-zinc-400">Manage your organization's executive committee profiles.</p>
        </div>
        <Link href="/admin/committee/create">
          <Button className="bg-brand-blue hover:bg-brand-blue/90">
            <Plus className="mr-2 h-4 w-4" /> Add Member
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-zinc-500">Loading committee members...</div>
          ) : committee.length === 0 ? (
            <div className="p-8 text-center text-zinc-500">No committee members found. Add one to get started.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="py-3 px-4 font-medium text-sm">Image</th>
                    <th className="py-3 px-4 font-medium text-sm">Name</th>
                    <th className="py-3 px-4 font-medium text-sm">Role</th>
                    <th className="py-3 px-4 font-medium text-sm">Order</th>
                    <th className="py-3 px-4 font-medium text-sm text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {committee.map((member) => (
                    <tr key={member.id} className="hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4">
                        {member.image_url ? (
                          <div className="relative w-10 h-10 rounded-full overflow-hidden">
                            <Image src={member.image_url} alt={member.name} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs">No Img</div>
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium">{member.name}</td>
                      <td className="py-3 px-4 text-zinc-500">{member.role}</td>
                      <td className="py-3 px-4 text-zinc-500">{member.order_index}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/committee/${member.id}/edit`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDelete(member.id)}
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
