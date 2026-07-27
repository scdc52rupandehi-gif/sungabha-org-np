'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

function getSupabase() {
  const cookieStore = cookies();
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
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('staff_members')
    .select('*')
    .order('order_index', { ascending: true })
    .order('created_at', { ascending: true });
    
  if (error) throw new Error(error.message);
  return data;
}

export async function getStaffById(id: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('staff_members')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) throw new Error(error.message);
  return data;
}

export async function createStaff(formData: FormData) {
  const supabase = getSupabase();
  
  const name = formData.get('name') as string;
  const name_ne = formData.get('name_ne') as string;
  const position = formData.get('position') as string;
  const position_ne = formData.get('position_ne') as string;
  const image_url = formData.get('image_url') as string;
  const order_index = parseInt(formData.get('order_index') as string || '0');

  const { error } = await supabase.from('staff_members').insert({
    name,
    name_ne,
    position,
    position_ne,
    image_url,
    order_index
  });

  if (error) throw new Error(error.message);
  revalidatePath('/[locale]/admin/staff', 'page');
  revalidatePath('/[locale]/about/staff', 'page');
}

export async function updateStaff(id: string, formData: FormData) {
  const supabase = getSupabase();
  
  const name = formData.get('name') as string;
  const name_ne = formData.get('name_ne') as string;
  const position = formData.get('position') as string;
  const position_ne = formData.get('position_ne') as string;
  const image_url = formData.get('image_url') as string;
  const order_index = parseInt(formData.get('order_index') as string || '0');

  const { error } = await supabase.from('staff_members').update({
    name,
    name_ne,
    position,
    position_ne,
    image_url,
    order_index
  }).eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/[locale]/admin/staff', 'page');
  revalidatePath('/[locale]/about/staff', 'page');
}

export async function deleteStaff(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from('staff_members').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/[locale]/admin/staff', 'page');
  revalidatePath('/[locale]/about/staff', 'page');
}
