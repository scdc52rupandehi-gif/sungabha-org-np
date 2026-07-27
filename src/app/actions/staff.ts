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

export async function getStaff() {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('staff_members')
    .select('*')
    .order('order_index', { ascending: true })
    .order('created_at', { ascending: false });
    
  if (error) throw new Error(error.message);
  return data;
}

export async function getStaffById(id: string) {
  const supabase = await getSupabase();
  const { data, error } = await supabase.from('staff_members').select('*').eq('id', id).single();
  if (error) throw new Error(error.message);
  return data;
}

export async function createStaff(formData: FormData) {
  const supabase = await getSupabase();
  
  const name = formData.get('name') as string;
  const position = formData.get('position') as string;
  const order_index = parseInt(formData.get('order_index') as string) || 0;
  
  const imageFile = formData.get('image') as File | null;
  let image_url = null;
  
  if (imageFile && imageFile.size > 0) {
    const ext = imageFile.name.split('.').pop();
    const fileName = `staff/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    
    const { error: uploadError } = await supabase.storage.from('media').upload(fileName, imageFile);
    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);
    
    const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(fileName);
    image_url = publicUrlData.publicUrl;
  }

  const payload = {
    name,
    position,
    image_url,
    order_index,
  };

  const { error } = await supabase.from('staff_members').insert(payload);

  if (error) throw new Error(error.message);
  revalidatePath('/[locale]/admin/staff', 'page');
  revalidatePath('/[locale]/about/staff', 'page');
}

export async function updateStaff(id: string, formData: FormData) {
  const supabase = await getSupabase();
  
  const name = formData.get('name') as string;
  const position = formData.get('position') as string;
  const order_index = parseInt(formData.get('order_index') as string) || 0;
  
  const imageFile = formData.get('image') as File | null;
  let image_url = formData.get('existing_image_url') as string | null;
  
  if (imageFile && imageFile.size > 0) {
    const ext = imageFile.name.split('.').pop();
    const fileName = `staff/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    
    const { error: uploadError } = await supabase.storage.from('media').upload(fileName, imageFile);
    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);
    
    const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(fileName);
    image_url = publicUrlData.publicUrl;
  }
  
  const payload = {
    name,
    position,
    image_url,
    order_index,
  };

  const { error } = await supabase.from('staff_members').update(payload).eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/[locale]/admin/staff', 'page');
  revalidatePath('/[locale]/about/staff', 'page');
}

export async function deleteStaff(id: string) {
  const supabase = await getSupabase();
  const { error } = await supabase.from('staff_members').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/[locale]/admin/staff', 'page');
  revalidatePath('/[locale]/about/staff', 'page');
}

