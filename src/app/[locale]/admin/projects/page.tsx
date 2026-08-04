"use client";
import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from "sonner";
import { DataTable } from "@/components/ui/data-table";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { deleteProject, markProjectComplete } from "@/app/actions/projects";

export default function ProjectListPage() {
  const supabase = createClient();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteProject(deleteId);
      toast.success("Deleted successfully");
      fetchItems();
    } catch (error) {
      toast.error("Failed to delete");
    } finally {
      setDeleteId(null);
    }
  };

  const handleMarkComplete = async (id: string) => {
    if (confirm("Are you sure you want to mark this project as completed?")) {
      try {
        await markProjectComplete(id);
        toast.success("Project marked as completed");
        fetchItems();
      } catch (error) {
        toast.error("Failed to update status");
      }
    }
  };

  const columns = [
    { header: "ID / Title", accessorKey: "title", cell: (item: any) => item.title || item.name || item.full_name || item.id },
    { header: "Status", accessorKey: "status", cell: (item: any) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        item.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
        item.status === 'Ongoing' || item.status === 'Active' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      }`}>
        {item.status || 'Active'}
      </span>
    )},
    { header: "Created At", accessorKey: "created_at", cell: (item: any) => new Date(item.created_at).toLocaleDateString() }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Projects</h2>
        <Link href="/admin/projects/create">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2">
            <Plus size={18} /> Add Project
          </Button>
        </Link>
      </div>
      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Manage Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={items} 
            searchKey="title" 
            actions={(item) => (
              <>
                {(item.status === 'Ongoing' || item.status === 'Active') && (
                  <Button variant="ghost" size="icon" onClick={() => handleMarkComplete(item.id)} title="Mark as Completed" className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20">
                    <CheckCircle size={16} />
                  </Button>
                )}
                <Link href={`/admin/projects/${item.id}/edit`}>
                  <Button variant="ghost" size="icon"><Edit size={16} /></Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)} className="text-red-500">
                  <Trash2 size={16} />
                </Button>
              </>
            )}
          />
        </CardContent>
      </Card>
      
      <DeleteDialog 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={handleDelete} 
      />
    </div>
  );
}
