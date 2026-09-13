"use server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

async function getSupabase() {
  const cookieStore = await cookies();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    key,
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

export async function createDownload(formData: FormData) {
  const supabase = await getSupabase();
  
  const attachedFile = formData.get('file') as File | null;
  let file_url = '';
  
  if (attachedFile && attachedFile.size > 0) {
    const ext = attachedFile.name.split('.').pop();
    const fileName = `documents/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    
    const { error: uploadError } = await supabase.storage.from('media').upload(fileName, attachedFile, {
      contentType: attachedFile.type,
      upsert: true
    });
    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);
    
    const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(fileName);
    file_url = publicUrlData.publicUrl;
  }
  
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const published_year = formData.get('published_year') as string;
  const category = formData.get('category') as string || 'Publication';
  
  const data: Record<string, any> = {
    title,
    description,
    published_year,
    category
  };

  if (file_url) {
    data.file_url = file_url;
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
    
    const { error: uploadError } = await supabase.storage.from('media').upload(fileName, attachedFile, {
      contentType: attachedFile.type,
      upsert: true
    });
    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);
    
    const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(fileName);
    file_url = publicUrlData.publicUrl;
  }
  
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const published_year = formData.get('published_year') as string;
  const category = formData.get('category') as string || 'Publication';
  
  const data: Record<string, any> = {
    title,
    description,
    published_year,
    category
  };
  
  if (file_url) {
    data.file_url = file_url;
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
