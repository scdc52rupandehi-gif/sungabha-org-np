"use client";
import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from "sonner";
import { DataTable } from "@/components/ui/data-table";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { deleteDonation, getDonations } from "@/app/actions/donations";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";

export default function DonationListPage() {
  const supabase = createClient();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedDonation, setSelectedDonation] = useState<any | null>(null);

  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await getDonations();
      if (error) throw new Error(error);
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
      await deleteDonation(deleteId);
      toast.success("Deleted successfully");
      fetchItems();
    } catch (error) {
      toast.error("Failed to delete");
    } finally {
      setDeleteId(null);
    }
  };

  const handleVerify = async () => {
    if (!selectedDonation) return;
    setVerifying(true);
    try {
      // Import the action dynamically to avoid top-level issues if needed, or just use the imported one.
      // Wait, we need to import it at the top of the file. I'll make sure verifyDonation is imported.
      const { verifyDonation } = await import("@/app/actions/donations");
      const res = await verifyDonation(selectedDonation.id);
      if (res.success) {
        toast.success("Payment verified & Certificate sent!");
        fetchItems();
        setSelectedDonation({ ...selectedDonation, status: 'verified' });
      } else {
        toast.error(res.error || "Failed to verify");
      }
    } catch (e) {
      toast.error("An error occurred");
    } finally {
      setVerifying(false);
    }
  };

  const columns = [
    { header: "Name", accessorKey: "name", cell: (item: any) => item.first_name ? `${item.first_name} ${item.last_name || ''}` : item.title || item.id },
    { header: "Email / Phone", accessorKey: "contact", cell: (item: any) => item.email || item.phone || 'N/A' },
    { header: "Amount", accessorKey: "amount", cell: (item: any) => item.amount ? <span className="font-semibold text-emerald-600 dark:text-emerald-400">{item.amount}</span> : 'N/A' },
    { header: "Status", accessorKey: "status", cell: (item: any) => (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.status === 'verified' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
        {item.status === 'verified' ? 'Verified' : 'Pending'}
      </span>
    )},
    { header: "Created At", accessorKey: "created_at", cell: (item: any) => new Date(item.created_at).toLocaleDateString() }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Donations</h2>
      </div>
      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Manage Donations</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={items} 
            searchKey="first_name" 
            actions={(item) => (
              <>
                <Button variant="ghost" size="icon" onClick={() => setSelectedDonation(item)}>
                  <Eye size={16} />
                </Button>
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

      {/* Donation Details Modal */}
      <Dialog open={!!selectedDonation} onOpenChange={(open) => !open && setSelectedDonation(null)}>
        <DialogContent className="max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold border-b border-zinc-100 dark:border-zinc-800 pb-4 flex justify-between items-center">
              <span>Donation Details</span>
              {selectedDonation?.status === 'verified' ? (
                <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full uppercase tracking-wider font-bold">Verified</span>
              ) : (
                <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full uppercase tracking-wider font-bold">Pending Verification</span>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedDonation && (
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Donor Name</h4>
                  <p className="font-medium">{selectedDonation.first_name ? `${selectedDonation.first_name} ${selectedDonation.last_name || ''}` : selectedDonation.title}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Date Sent</h4>
                  <p className="font-medium">{new Date(selectedDonation.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Email Address</h4>
                  <p className="font-medium">{selectedDonation.email || 'Not provided'}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Phone Number</h4>
                  <p className="font-medium">{selectedDonation.phone || 'Not provided'}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Amount</h4>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400 text-lg">{selectedDonation.amount || 'Not specified'}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Purpose</h4>
                  <p className="font-medium">{selectedDonation.purpose || 'General'}</p>
                </div>
                {selectedDonation.message && (
                  <div className="col-span-2 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Message Content</h4>
                    <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-lg border border-zinc-100 dark:border-zinc-800 whitespace-pre-wrap text-sm leading-relaxed text-zinc-800 dark:text-zinc-300">
                      {selectedDonation.message}
                    </div>
                  </div>
                )}
                
                {selectedDonation.screenshot_url && (
                  <div className="col-span-2 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Payment Screenshot</h4>
                    <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden flex justify-center bg-zinc-50 dark:bg-zinc-900">
                      <Image 
                        src={selectedDonation.screenshot_url} 
                        alt="Payment Screenshot" 
                        width={600} 
                        height={400} 
                        className="max-h-[500px] object-contain" 
                        unoptimized
                      />
                    </div>
                    <div className="mt-2 text-center">
                      <a href={selectedDonation.screenshot_url} target="_blank" rel="noreferrer" className="text-sm text-emerald-600 hover:underline">
                        Open in New Tab
                      </a>
                    </div>
                  </div>
                )}
              </div>
              
              {(!selectedDonation.status || selectedDonation.status === 'pending') && (
                <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                  <Button 
                    onClick={handleVerify} 
                    disabled={verifying}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-6 font-bold text-lg rounded-xl shadow-lg w-full"
                  >
                    {verifying ? "Verifying & Sending..." : "Verify Payment & Send Certificate"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
