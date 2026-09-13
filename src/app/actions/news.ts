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

export async function createNews(formData: FormData) {
  const supabase = await getSupabase();
  try {
    const attachedFile = formData.get('attached_file') as File | null;
    let attached_file_url = null;
    
    if (attachedFile && attachedFile.size > 0) {
      const ext = attachedFile.name.split('.').pop();
      const fileName = `news_events/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
      
      const arrayBuffer = await attachedFile.arrayBuffer();
      const { error: uploadError } = await supabase.storage.from('media').upload(fileName, arrayBuffer, {
        contentType: attachedFile.type,
        upsert: true
      });
      if (uploadError) return { success: false, error: `Upload failed: ${uploadError.message}` };
      
      const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(fileName);
      attached_file_url = publicUrlData.publicUrl;
    }
    
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const type = formData.get('type') as string || 'News';
    const is_published = formData.get('is_published') === 'true' || formData.get('is_published') === 'on';
    
    const data: Record<string, any> = {
      title,
      content,
      type,
      is_published,
    };

    if (attached_file_url) {
      data.attached_file_url = attached_file_url;
    }
    
    if (title) {
      data.slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);
    }

    const { error } = await supabase.from('news_events').insert(data);
    if (error) return { success: false, error: error.message };
    
    revalidatePath("/admin/news");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Server action failed" };
  }
}

export async function updateNews(id: string, formData: FormData) {
  const supabase = await getSupabase();
  
  const attachedFile = formData.get('attached_file') as File | null;
  let attached_file_url = formData.get('existing_file_url') as string | null;
  
  if (attachedFile && attachedFile.size > 0) {
    const ext = attachedFile.name.split('.').pop();
    const fileName = `news_events/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    
    const { error: uploadError } = await supabase.storage.from('media').upload(fileName, attachedFile, {
      contentType: attachedFile.type,
      upsert: true
    });
    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);
    
    const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(fileName);
    attached_file_url = publicUrlData.publicUrl;
  }
  
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const type = formData.get('type') as string || 'News';
  const is_published = formData.get('is_published') === 'true' || formData.get('is_published') === 'on';
  
  const data: Record<string, any> = {
    title,
    content,
    type,
    is_published,
    attached_file_url: attached_file_url || null
  };

  const { error } = await supabase.from('news_events').update(data).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/news");
}

export async function deleteNews(id: string) {
  const supabase = await getSupabase();
  const { error } = await supabase.from('news_events').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/news");
}

