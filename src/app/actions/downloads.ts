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

export async function createDownload(formData: FormData) {
  const supabase = await getSupabase();
  
  const attachedFile = formData.get('file') as File | null;
  let file_url = '';
  
  if (attachedFile && attachedFile.size > 0) {
    const ext = attachedFile.name.split('.').pop();
    const fileName = `documents/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    const arrayBuffer = await attachedFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const { error: uploadError } = await supabase.storage.from('media').upload(fileName, buffer, {
      contentType: attachedFile.type,
    });
    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);
    
    const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(fileName);
    file_url = publicUrlData.publicUrl;
  }
  
  formData.delete('file');
  const data: Record<string, any> = Object.fromEntries(formData.entries());
  if (file_url) {
    data.file_url = file_url;
  }
  
  if (!data.category) {
    data.category = 'Publication';
  }

  const { error } = await supabase.from('documents').insert(data);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/downloads");
}

export async function updateDownload(id: string, formData: FormData) {
  const supabase = await getSupabase();
  
  const attachedFile = formData.get('file') as File | null;
  let file_url = formData.get('existing_file_url') as string | null;
  
  if (attachedFile && attachedFile.size > 0) {
    const ext = attachedFile.name.split('.').pop();
    const fileName = `documents/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    const arrayBuffer = await attachedFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const { error: uploadError } = await supabase.storage.from('media').upload(fileName, buffer, {
      contentType: attachedFile.type,
    });
    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);
    
    const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(fileName);
    file_url = publicUrlData.publicUrl;
  }
  
  formData.delete('file');
  formData.delete('existing_file_url');
  
  const data: Record<string, any> = Object.fromEntries(formData.entries());
  if (file_url) {
    data.file_url = file_url;
  }

  if (!data.category) {
    data.category = 'Publication';
  }

  const { error } = await supabase.from('documents').update(data).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/downloads");
}

export async function deleteDownload(id: string) {
  const supabase = await getSupabase();
  const { error } = await supabase.from('documents').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/downloads");
}
