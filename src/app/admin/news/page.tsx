"use client";
import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from "sonner";
import { DataTable } from "@/components/ui/data-table";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { deleteNews } from "@/app/actions/news";

export default function NewsListPage() {
  const supabase = createClient();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase.from('news_events').select('*').order('created_at', { ascending: false });
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
      await deleteNews(deleteId);
      toast.success("Deleted successfully");
      fetchItems();
    } catch (error) {
      toast.error("Failed to delete");
    } finally {
      setDeleteId(null);
    }
  };

  const columns = [
    { header: "ID / Title", accessorKey: "title", cell: (item: any) => item.title || item.name || item.full_name || item.id },
    { header: "Created At", accessorKey: "created_at", cell: (item: any) => new Date(item.created_at).toLocaleDateString() }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Newss</h2>
        <Link href="/admin/news/create">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2">
            <Plus size={18} /> Add News
          </Button>
        </Link>
      </div>
      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Manage Newss</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={items} 
            searchKey="title" 
            actions={(item) => (
              <>
                <Link href={`/admin/news/${item.id}/edit`}>
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
