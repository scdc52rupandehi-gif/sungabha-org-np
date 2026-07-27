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

export async function getGalleryImageById(id: string) {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) throw new Error(error.message);
  return data;
}

export async function createGalleryImage(formData: FormData) {
  const supabase = await getSupabase();
  const title = formData.get('title') as string;
  const title_ne = formData.get('title_ne') as string;
  const imageFiles = formData.getAll('image') as File[];
  
  if (!imageFiles || imageFiles.length === 0 || imageFiles[0].size === 0) {
    throw new Error("At least one image file is required");
  }

  const inserts = [];

  for (const imageFile of imageFiles) {
    if (imageFile.size > 0) {
      const ext = imageFile.name.split('.').pop();
      const fileName = `gallery/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
      
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const { error: uploadError } = await supabase.storage.from('media').upload(fileName, buffer, {
        contentType: imageFile.type,
        upsert: false
      });

      if (uploadError) throw new Error(`Failed to upload image: ${uploadError.message}`);
      
      const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(fileName);
      inserts.push({
        title,
        title_ne,
        image_url: publicUrlData.publicUrl
      });
    }
  }

  if (inserts.length > 0) {
    const { error } = await supabase.from('gallery_images').insert(inserts);
    if (error) throw new Error(error.message);
  }
  
  revalidatePath('/[locale]/admin/gallery', 'page');
  revalidatePath('/[locale]/gallery/photos', 'page');
}

export async function updateGalleryImage(id: string, formData: FormData) {
  const supabase = await getSupabase();
  const title = formData.get('title') as string;
  const title_ne = formData.get('title_ne') as string;
  const imageFile = formData.get('image') as File | null;
  let image_url = formData.get('existing_image_url') as string;

  if (imageFile && imageFile.size > 0) {
    const ext = imageFile.name.split('.').pop();
    const fileName = `gallery/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const { error: uploadError } = await supabase.storage.from('media').upload(fileName, buffer, {
      contentType: imageFile.type,
      upsert: false
    });

    if (uploadError) throw new Error(`Failed to upload image: ${uploadError.message}`);
    
    const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(fileName);
    image_url = publicUrlData.publicUrl;
  }

  const { error } = await supabase.from('gallery_images').update({ title, title_ne, image_url }).eq('id', id);
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

export async function getGalleryVideoById(id: string) {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('gallery_videos')
    .select('*')
    .eq('id', id)
    .single();
    
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

export async function updateGalleryVideo(id: string, formData: FormData) {
  const supabase = await getSupabase();
  const title = formData.get('title') as string;
  const title_ne = formData.get('title_ne') as string;
  const video_url = formData.get('video_url') as string;

  const { error } = await supabase.from('gallery_videos').update({ title, title_ne, video_url }).eq('id', id);
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
