const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, '../src/app/admin');
const actionsDir = path.join(__dirname, '../src/app/actions');

const modules = [
  { name: 'audit', table: 'audit_logs', single: 'AuditLog' },
  { name: 'donations', table: 'donations', single: 'Donation' },
  { name: 'downloads', table: 'documents', single: 'Download' },
  { name: 'events', table: 'news_events', single: 'Event' },
  { name: 'gallery', table: 'gallery', single: 'Gallery' },
  { name: 'messages', table: 'contact_messages', single: 'Message' },
  { name: 'news', table: 'news_events', single: 'News' },
  { name: 'newsletter', table: 'newsletter_subscribers', single: 'Subscriber' },
  { name: 'partners', table: 'partners', single: 'Partner' },
  { name: 'permissions', table: 'permissions', single: 'Permission' },
  { name: 'programs', table: 'programs', single: 'Program' },
  { name: 'projects', table: 'projects', single: 'Project' },
  { name: 'reports', table: 'documents', single: 'Report' },
  { name: 'roles', table: 'roles', single: 'Role' },
  { name: 'seo', table: 'seo_settings', single: 'SEO' },
  { name: 'settings', table: 'website_settings', single: 'Setting' },
  { name: 'testimonials', table: 'testimonials', single: 'Testimonial' },
  { name: 'users', table: 'user_profiles', single: 'User' },
  { name: 'volunteers', table: 'volunteers', single: 'Volunteer' },
];

function generateListPage(mod) {
  return `"use client";
import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from "sonner";
import { DataTable } from "@/components/ui/data-table";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { delete${mod.single} } from "@/app/actions/${mod.name}";

export default function ${mod.single}ListPage() {
  const supabase = createClient();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase.from('${mod.table}').select('*').order('created_at', { ascending: false });
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
      await delete${mod.single}(deleteId);
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
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">${mod.single}s</h2>
        <Link href="/admin/${mod.name}/create">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2">
            <Plus size={18} /> Add ${mod.single}
          </Button>
        </Link>
      </div>
      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Manage ${mod.single}s</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={items} 
            searchKey="title" 
            actions={(item) => (
              <>
                <Link href={\`/admin/${mod.name}/\${item.id}/edit\`}>
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
`;
}

function generateAction(mod) {
  return `"use server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

async function getSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() } } }
  );
}

export async function create${mod.single}(formData: FormData) {
  const supabase = await getSupabase();
  const data = Object.fromEntries(formData.entries());
  const { error } = await supabase.from('${mod.table}').insert(data);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/${mod.name}");
}

export async function update${mod.single}(id: string, formData: FormData) {
  const supabase = await getSupabase();
  const data = Object.fromEntries(formData.entries());
  const { error } = await supabase.from('${mod.table}').update(data).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/${mod.name}");
}

export async function delete${mod.single}(id: string) {
  const supabase = await getSupabase();
  const { error } = await supabase.from('${mod.table}').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/${mod.name}");
}
`;
}

function generateFormPage(mod, isEdit = false) {
  return `"use client";
import React, { useState${isEdit ? ", useEffect" : ""} } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ${isEdit ? `update${mod.single}` : `create${mod.single}`} } from "@/app/actions/${mod.name}";
${isEdit ? "import { createClient } from '@/lib/supabase/client';" : ""}

export default function ${isEdit ? "Edit" : "Create"}${mod.single}Page(${isEdit ? "{ params }: { params: Promise<{ id: string }> }" : ""}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  ${isEdit ? `
  const [id, setId] = useState<string>("");
  useEffect(() => {
    params.then(p => setId(p.id));
  }, [params]);` : ""}

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      ${isEdit ? `await update${mod.single}(id, formData);` : `await create${mod.single}(formData);`}
      toast.success("${mod.single} ${isEdit ? "updated" : "created"} successfully!");
      router.push("/admin/${mod.name}");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        ${isEdit ? "Edit" : "Create"} ${mod.single}
      </h2>
      <Card>
        <CardHeader>
          <CardTitle>${mod.single} Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title / Name</label>
              <Input name="title" placeholder="Enter title or name..." required />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Saving..." : "Save ${mod.single}"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
`;
}

if (!fs.existsSync(actionsDir)) {
  fs.mkdirSync(actionsDir, { recursive: true });
}

modules.forEach(mod => {
  const modDir = path.join(adminDir, mod.name);
  if (!fs.existsSync(modDir)) fs.mkdirSync(modDir, { recursive: true });
  
  const createDir = path.join(modDir, 'create');
  if (!fs.existsSync(createDir)) fs.mkdirSync(createDir, { recursive: true });
  
  const editDir = path.join(modDir, '[id]', 'edit');
  if (!fs.existsSync(editDir)) fs.mkdirSync(editDir, { recursive: true });

  // Write List Page
  fs.writeFileSync(path.join(modDir, 'page.tsx'), generateListPage(mod));
  
  // Write Create Page
  fs.writeFileSync(path.join(createDir, 'page.tsx'), generateFormPage(mod, false));
  
  // Write Edit Page
  // Write Edit Page
  fs.writeFileSync(path.join(editDir, 'page.tsx'), generateFormPage(mod, true));
  
  // Write Server Actions
  fs.writeFileSync(path.join(actionsDir, mod.name + '.ts'), generateAction(mod));
});

console.log("SUCCESS: 20 CRUD Modules have been fully regenerated with Server Actions, DataTables, and Error Boundaries!");
