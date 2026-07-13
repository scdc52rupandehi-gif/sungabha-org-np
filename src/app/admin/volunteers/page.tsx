"use client";
import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Eye, Download, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { toast } from "sonner";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { deleteVolunteer } from "@/app/actions/volunteers";
import { Input } from '@/components/ui/input';

export default function VolunteerListPage() {
  const supabase = createClient();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase.from('volunteers').select('*').order('created_at', { ascending: false });
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
      await deleteVolunteer(deleteId);
      toast.success("Deleted successfully");
      fetchItems();
    } catch (error) {
      toast.error("Failed to delete");
    } finally {
      setDeleteId(null);
    }
  };

  const exportCSV = () => {
    if (items.length === 0) return;
    const headers = ["Reference ID", "Full Name", "Email", "Phone", "District", "Status", "Created At"];
    const csvContent = [
      headers.join(","),
      ...items.map(row => [
        row.reference_id,
        `"${row.full_name}"`,
        row.email,
        row.phone,
        `"${row.district}"`,
        row.status,
        new Date(row.created_at).toLocaleDateString()
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `volunteers_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Stats
  const total = items.length;
  const pending = items.filter(i => i.status === 'Pending').length;
  const approved = items.filter(i => i.status === 'Approved').length;
  const rejected = items.filter(i => i.status === 'Rejected').length;
  const interviewing = items.filter(i => i.status === 'Interview Scheduled').length;

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pending': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'Approved': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'Rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'Joined': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      default: return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700';
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = (item.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.reference_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.email?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Volunteer Applications</h2>
          <p className="text-muted-foreground mt-1 text-sm">Manage volunteer registrations, statuses, and profiles.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCSV} className="gap-2">
            <Download size={16} /> Export CSV
          </Button>
          <Link href="/volunteer" target="_blank">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2">
              <Plus size={18} /> Public Form
            </Button>
          </Link>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-card shadow-sm"><CardContent className="p-4"><p className="text-sm font-medium text-muted-foreground">Total</p><p className="text-2xl font-bold">{total}</p></CardContent></Card>
        <Card className="bg-card shadow-sm"><CardContent className="p-4"><p className="text-sm font-medium text-amber-600 dark:text-amber-500">Pending</p><p className="text-2xl font-bold">{pending}</p></CardContent></Card>
        <Card className="bg-card shadow-sm"><CardContent className="p-4"><p className="text-sm font-medium text-brand-blue">Interview</p><p className="text-2xl font-bold">{interviewing}</p></CardContent></Card>
        <Card className="bg-card shadow-sm"><CardContent className="p-4"><p className="text-sm font-medium text-emerald-600 dark:text-emerald-500">Approved</p><p className="text-2xl font-bold">{approved}</p></CardContent></Card>
        <Card className="bg-card shadow-sm"><CardContent className="p-4"><p className="text-sm font-medium text-red-600 dark:text-red-500">Rejected</p><p className="text-2xl font-bold">{rejected}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="pb-4 border-b border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <CardTitle>Applications List</CardTitle>
            <div className="flex gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search name, ref, email..." 
                  className="pl-9 h-9" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select 
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Under Review">Under Review</option>
                <option value="Contacted">Contacted</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Joined">Joined</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Ref ID</th>
                  <th className="px-6 py-4">Applicant</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">District</th>
                  <th className="px-6 py-4">Applied On</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr><td colSpan={7} className="text-center py-10 text-muted-foreground">Loading applications...</td></tr>
                ) : filteredItems.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-10 text-muted-foreground">No applications found.</td></tr>
                ) : (
                  filteredItems.map(item => (
                    <tr key={item.id} className="hover:bg-accent/50 transition-colors">
                      <td className="px-6 py-4 font-mono font-medium text-brand-blue">{item.reference_id}</td>
                      <td className="px-6 py-4 font-semibold">{item.full_name}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 text-xs">
                          <span className="font-medium text-foreground">{item.phone}</span>
                          <span className="text-muted-foreground">{item.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{item.district}</td>
                      <td className="px-6 py-4 text-muted-foreground">{new Date(item.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/volunteers/${item.id}`}>
                            <Button variant="outline" size="icon" className="h-8 w-8 text-brand-blue hover:text-brand-blue/80 hover:bg-brand-blue/10">
                              <Eye size={14} />
                            </Button>
                          </Link>
                          <Button variant="outline" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => setDeleteId(item.id)}>
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
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
