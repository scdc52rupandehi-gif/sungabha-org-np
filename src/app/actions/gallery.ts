'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

async function getSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (error) {}
        },
      },
    }
  );
}

// Images
export async function getGalleryImages() {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw new Error(error.message);
  return data;
}

export async function createGalleryImage(formData: FormData) {
  const supabase = await getSupabase();
  const title = formData.get('title') as string;
  const title_ne = formData.get('title_ne') as string;
  const image_url = formData.get('image_url') as string;

  const { error } = await supabase.from('gallery_images').insert({ title, title_ne, image_url });
  if (error) throw new Error(error.message);
  revalidatePath('/[locale]/admin/gallery', 'page');
  revalidatePath('/[locale]/gallery/photos', 'page');
}

export async function deleteGalleryImage(id: string) {
  const supabase = await getSupabase();
  const { error } = await supabase.from('gallery_images').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/[locale]/admin/gallery', 'page');
  revalidatePath('/[locale]/gallery/photos', 'page');
}

// Videos
export async function getGalleryVideos() {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('gallery_videos')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw new Error(error.message);
  return data;
}

export async function createGalleryVideo(formData: FormData) {
  const supabase = await getSupabase();
  const title = formData.get('title') as string;
  const title_ne = formData.get('title_ne') as string;
  const video_url = formData.get('video_url') as string;

  const { error } = await supabase.from('gallery_videos').insert({ title, title_ne, video_url });
  if (error) throw new Error(error.message);
  revalidatePath('/[locale]/admin/gallery', 'page');
  revalidatePath('/[locale]/gallery/videos', 'page');
}

export async function deleteGalleryVideo(id: string) {
  const supabase = await getSupabase();
  const { error } = await supabase.from('gallery_videos').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/[locale]/admin/gallery', 'page');
  revalidatePath('/[locale]/gallery/videos', 'page');
}
