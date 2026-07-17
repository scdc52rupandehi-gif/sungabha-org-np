"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from 'lucide-react';
import { toast } from "sonner";
import { DataTable } from "@/components/ui/data-table";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { deleteMessage, getMessages } from "@/app/actions/messages";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function MessageListPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteData, setDeleteData] = useState<{ id: string, type: 'contact' | 'whistleblower' } | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await getMessages();
      setItems(data);
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteData) return;
    try {
      await deleteMessage(deleteData.id, deleteData.type);
      toast.success("Deleted successfully");
      fetchItems();
    } catch (error) {
      toast.error("Failed to delete");
    } finally {
      setDeleteData(null);
    }
  };

  const columns = [
    { 
      header: "Type", 
      accessorKey: "typeLabel", 
      cell: (item: any) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item._type === 'whistleblower' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'}`}>
          {item.typeLabel}
        </span>
      ) 
    },
    { header: "Name", accessorKey: "name", cell: (item: any) => item.name || 'Anonymous' },
    { header: "Email / Phone", accessorKey: "contact", cell: (item: any) => item.email || item.phone || 'N/A' },
    { header: "Created At", accessorKey: "created_at", cell: (item: any) => new Date(item.created_at).toLocaleDateString() }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Messages</h2>
      </div>
      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Manage Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={items} 
            searchKey="name" 
            actions={(item) => (
              <>
                <Button variant="ghost" size="icon" onClick={() => setSelectedMessage(item)}>
                  <Eye size={16} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setDeleteData({ id: item.id, type: item._type })} className="text-red-500">
                  <Trash2 size={16} />
                </Button>
              </>
            )}
          />
        </CardContent>
      </Card>
      
      <DeleteDialog 
        isOpen={!!deleteData} 
        onClose={() => setDeleteData(null)} 
        onConfirm={handleDelete} 
      />

      {/* Message Details Modal */}
      <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
        <DialogContent className="max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold border-b border-zinc-100 dark:border-zinc-800 pb-4">
              Message Details - {selectedMessage?.typeLabel}
            </DialogTitle>
          </DialogHeader>
          
          {selectedMessage && (
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Sender Name</h4>
                  <p className="font-medium">{selectedMessage.name || 'Anonymous'}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Date Sent</h4>
                  <p className="font-medium">{new Date(selectedMessage.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Email Address</h4>
                  <p className="font-medium">{selectedMessage.email || 'Not provided'}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Phone Number</h4>
                  <p className="font-medium">{selectedMessage.phone || 'Not provided'}</p>
                </div>
                {selectedMessage.subject && (
                  <div className="col-span-2">
                    <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Subject</h4>
                    <p className="font-medium">{selectedMessage.subject}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Message Content</h4>
                <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-lg border border-zinc-100 dark:border-zinc-800 whitespace-pre-wrap text-sm leading-relaxed text-zinc-800 dark:text-zinc-300">
                  {selectedMessage.message}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
