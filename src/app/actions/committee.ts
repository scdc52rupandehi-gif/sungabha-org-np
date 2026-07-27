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

export async function getCommittee() {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('executive_committee')
    .select('*')
    .order('order_index', { ascending: true })
    .order('created_at', { ascending: false });
    
  if (error) throw new Error(error.message);
  return data;
}

export async function getCommitteeById(id: string) {
  const supabase = await getSupabase();
  const { data, error } = await supabase.from('executive_committee').select('*').eq('id', id).single();
  if (error) throw new Error(error.message);
  return data;
}

export async function createCommittee(formData: FormData) {
  const supabase = await getSupabase();
  
  const name = formData.get('name') as string;
  const role = formData.get('role') as string;
  const experience = formData.get('experience') as string;
  const tenure = formData.get('tenure') as string;
  const order_index = parseInt(formData.get('order_index') as string) || 0;
  
  const imageFile = formData.get('image') as File | null;
  let image_url = null;
  
  if (imageFile && imageFile.size > 0) {
    const ext = imageFile.name.split('.').pop();
    const fileName = `committee/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const { error: uploadError } = await supabase.storage.from('media').upload(fileName, buffer, {
      contentType: imageFile.type,
    });
    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);
    
    const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(fileName);
    image_url = publicUrlData.publicUrl;
  }

  const payload = {
    name,
    role,
    experience,
    tenure,
    image_url,
    order_index,
  };

  const { error } = await supabase.from('executive_committee').insert(payload);

  if (error) throw new Error(error.message);
  revalidatePath('/[locale]/admin/committee', 'page');
  revalidatePath('/[locale]/about/executive-committee', 'page');
}

export async function updateCommittee(id: string, formData: FormData) {
  const supabase = await getSupabase();
  
  const name = formData.get('name') as string;
  const role = formData.get('role') as string;
  const experience = formData.get('experience') as string;
  const tenure = formData.get('tenure') as string;
  const order_index = parseInt(formData.get('order_index') as string) || 0;
  
  const imageFile = formData.get('image') as File | null;
  let image_url = formData.get('existing_image_url') as string | null;
  
  if (imageFile && imageFile.size > 0) {
    const ext = imageFile.name.split('.').pop();
    const fileName = `committee/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const { error: uploadError } = await supabase.storage.from('media').upload(fileName, buffer, {
      contentType: imageFile.type,
    });
    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);
    
    const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(fileName);
    image_url = publicUrlData.publicUrl;
  }
  
  const payload = {
    name,
    role,
    experience,
    tenure,
    image_url,
    order_index,
  };

  const { error } = await supabase.from('executive_committee').update(payload).eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/[locale]/admin/committee', 'page');
  revalidatePath('/[locale]/about/executive-committee', 'page');
}

export async function deleteCommittee(id: string) {
  const supabase = await getSupabase();
  const { error } = await supabase.from('executive_committee').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/[locale]/admin/committee', 'page');
  revalidatePath('/[locale]/about/executive-committee', 'page');
}
