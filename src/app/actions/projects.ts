"use server";
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

export async function createProject(formData: FormData) {
  const supabase = await getSupabase();
  
  const title = formData.get('title') as string;
  let slug = formData.get('slug') as string;
  if (!slug && title) {
    slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }

  // Parse arrays
  let images: string[] = [];
  try { images = JSON.parse((formData.get('images') as string) || '[]'); } catch(e){}
  
  let achievements: string[] = [];
  try { achievements = JSON.parse((formData.get('achievements') as string) || '[]'); } catch(e){}

  const data = {
    title,
    slug,
    description: formData.get('description'),
    partner: formData.get('partner'),
    duration: formData.get('duration'),
    status: formData.get('status') || 'Active',
    location: formData.get('location'),
    featured_image: formData.get('featured_image'),
    images,
    achievements
  };

  const { error } = await supabase.from('projects').insert(data);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/");
}

export async function updateProject(id: string, formData: FormData) {
  const supabase = await getSupabase();
  
  const title = formData.get('title') as string;
  let slug = formData.get('slug') as string;
  if (!slug && title) {
    slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }

  // Parse arrays
  let images: string[] = [];
  try { images = JSON.parse((formData.get('images') as string) || '[]'); } catch(e){}
  
  let achievements: string[] = [];
  try { achievements = JSON.parse((formData.get('achievements') as string) || '[]'); } catch(e){}

  const data = {
    title,
    slug,
    description: formData.get('description'),
    partner: formData.get('partner'),
    duration: formData.get('duration'),
    status: formData.get('status'),
    location: formData.get('location'),
    featured_image: formData.get('featured_image'),
    images,
    achievements
  };

  const { error } = await supabase.from('projects').update(data).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath(`/projects/${slug}`);
  revalidatePath("/");
}

export async function deleteProject(id: string) {
  const supabase = await getSupabase();
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/");
}

export async function markProjectComplete(id: string) {
  const supabase = await getSupabase();
  const { error } = await supabase.from('projects').update({ status: 'Completed' }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/");
}
