import fs from 'fs';
import path from 'path';

const modules = [
  { name: 'users', singular: 'User', table: 'user_profiles', fields: ['full_name', 'role_id', 'is_active'] },
  { name: 'roles', singular: 'Role', table: 'roles', fields: ['name', 'description'] },
  { name: 'permissions', singular: 'Permission', table: 'permissions', fields: ['name', 'description'] },
  { name: 'projects', singular: 'Project', table: 'projects', fields: ['title', 'slug', 'status'] },
  { name: 'programs', singular: 'Program', table: 'programs', fields: ['title', 'slug', 'category'] },
  { name: 'events', singular: 'Event', table: 'news_events', fields: ['title', 'type', 'event_date'] },
  { name: 'news', singular: 'News', table: 'news_events', fields: ['title', 'type', 'is_published'] },
  { name: 'gallery', singular: 'Gallery', table: 'gallery', fields: ['title', 'type', 'media_url'] },
  { name: 'reports', singular: 'Report', table: 'documents', fields: ['title', 'category', 'published_year'] },
  { name: 'downloads', singular: 'Download', table: 'documents', fields: ['title', 'category', 'file_url'] },
  { name: 'donations', singular: 'Donation', table: 'donations', fields: ['donor_name', 'amount', 'status'] },
  { name: 'partners', singular: 'Partner', table: 'partners', fields: ['name', 'website_url', 'is_active'] },
  { name: 'volunteers', singular: 'Volunteer', table: 'volunteers', fields: ['full_name', 'email', 'status'] },
  { name: 'testimonials', singular: 'Testimonial', table: 'testimonials', fields: ['name', 'designation', 'is_approved'] },
  { name: 'newsletter', singular: 'Subscriber', table: 'newsletter_subscribers', fields: ['email', 'is_active'] },
  { name: 'seo', singular: 'SEO', table: 'seo_settings', fields: ['page_route', 'meta_title', 'is_active'] },
  { name: 'settings', singular: 'Setting', table: 'website_settings', fields: ['site_name', 'contact_email'] },
  { name: 'audit', singular: 'AuditLog', table: 'audit_logs', fields: ['action', 'entity_type', 'created_at'] },
  { name: 'messages', singular: 'Message', table: 'contact_messages', fields: ['first_name', 'email', 'status'] }
];

const createDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

for (const mod of modules) {
  const baseDir = path.join(process.cwd(), 'src', 'app', 'admin', mod.name);
  const createDirName = path.join(baseDir, 'create');
  const editDirName = path.join(baseDir, '[id]', 'edit');
  
  createDir(baseDir);
  createDir(createDirName);
  createDir(editDirName);

  // 1. List Page
  const listPage = `"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from "sonner";

export default function ${mod.singular.replace(/\s+/g, '')}ListPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async (id: string) => {
    if(!confirm("Are you sure?")) return;
    try {
      const { error } = await supabase.from('${mod.table}').delete().eq('id', id);
      if (error) throw error;
      toast.success("Deleted successfully");
      fetchItems();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">${mod.name.charAt(0).toUpperCase() + mod.name.slice(1)}</h2>
        <Link href="/admin/${mod.name}/create">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2">
            <Plus size={18} /> Add ${mod.singular}
          </Button>
        </Link>
      </div>
      <Card>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <CardTitle>Manage ${mod.name}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-zinc-200 dark:border-zinc-800 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-zinc-50 dark:bg-zinc-900/50">
                <tr>
                  ${mod.fields.map(f => `<th className="px-6 py-4 font-medium">${f.replace('_', ' ')}</th>`).join('')}
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item: any) => (
                  <tr key={item.id} className="border-t border-zinc-100 dark:border-zinc-800">
                    ${mod.fields.map(f => `<td className="px-6 py-4">{String(item.${f})}</td>`).join('')}
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <Link href={\`/admin/${mod.name}/\${item.id}/edit\`}>
                        <Button variant="ghost" size="icon"><Edit size={16} /></Button>
                      </Link>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="text-red-500"><Trash2 size={16} /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}`;

  fs.writeFileSync(path.join(baseDir, 'page.tsx'), listPage);

  // 2. Create Page
  const createPage = `"use client";
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const schema = z.object({
  ${mod.fields.map(f => `${f}: z.string().min(1, "Required"),`).join('\n  ')}
});

export default function Create${mod.singular.replace(/\s+/g, '')}Page() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: any) => {
    try {
      const { error } = await supabase.from('${mod.table}').insert([data]);
      if (error) throw error;
      toast.success("${mod.singular} created successfully");
      router.push('/admin/${mod.name}');
    } catch (error: any) {
      toast.error(error.message || "Failed to create");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Create ${mod.singular}</h2>
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            ${mod.fields.map(f => `
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">${f.replace('_', ' ')}</label>
              <input {...register('${f}')} className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2" />
              {errors.${f} && <p className="text-red-500 text-xs">{String(errors.${f}?.message)}</p>}
            </div>`).join('')}
            <Button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
              {isSubmitting ? 'Saving...' : 'Save ${mod.singular}'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}`;

  fs.writeFileSync(path.join(createDirName, 'page.tsx'), createPage);

  // 3. Edit Page
  const editPage = `"use client";
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const schema = z.object({
  ${mod.fields.map(f => `${f}: z.string().min(1, "Required"),`).join('\n  ')}
});

export default function Edit${mod.singular.replace(/\s+/g, '')}Page() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema)
  });

  useEffect(() => {
    const fetchItem = async () => {
      const { data, error } = await supabase.from('${mod.table}').select('*').eq('id', id).single();
      if (data) reset(data);
      setLoading(false);
    };
    if (id) fetchItem();
  }, [id, reset]);

  const onSubmit = async (data: any) => {
    try {
      const { error } = await supabase.from('${mod.table}').update(data).eq('id', id);
      if (error) throw error;
      toast.success("${mod.singular} updated successfully");
      router.push('/admin/${mod.name}');
    } catch (error: any) {
      toast.error(error.message || "Failed to update");
    }
  };

  if(loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Edit ${mod.singular}</h2>
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            ${mod.fields.map(f => `
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">${f.replace('_', ' ')}</label>
              <input {...register('${f}')} className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2" />
              {errors.${f} && <p className="text-red-500 text-xs">{String(errors.${f}?.message)}</p>}
            </div>`).join('')}
            <Button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
              {isSubmitting ? 'Saving...' : 'Update ${mod.singular}'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}`;

  fs.writeFileSync(path.join(editDirName, 'page.tsx'), editPage);
}

console.log("Scaffold complete!");
