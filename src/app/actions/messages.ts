"use server";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { sendNotificationEmail } from "@/lib/mail";

function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}

export async function createMessage(formData: FormData) {
  const supabase = getAdminSupabase();
  const data = Object.fromEntries(formData.entries());
  
  const payload = {
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    phone: data.phone || null,
    subject: data.subject,
    message: data.message,
  };
  
  const { error } = await supabase.from('contact_messages').insert(payload);
  if (error) throw new Error(error.message);
  
  // Send email notification in the background
  await sendNotificationEmail({
    type: 'Contact Form',
    name: `${data.first_name} ${data.last_name}`,
    email: data.email as string,
    phone: data.phone as string,
    subject: data.subject as string,
    message: data.message as string,
  });

  revalidatePath("/admin/messages");
}

export async function updateMessage(id: string, formData: FormData) {
  const supabase = getAdminSupabase();
  const data = Object.fromEntries(formData.entries());
  const { error } = await supabase.from('contact_messages').update(data).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string, type: 'contact' | 'whistleblower' = 'contact') {
  const supabase = getAdminSupabase();
  const table = type === 'whistleblower' ? 'whistleblower_messages' : 'contact_messages';
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/messages");
}

export async function getMessages() {
  const supabase = getAdminSupabase();
  
  const [contactRes, whistleRes] = await Promise.all([
    supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
    supabase.from('whistleblower_messages').select('*').order('created_at', { ascending: false })
  ]);

  if (contactRes.error) throw new Error(contactRes.error.message);
  if (whistleRes.error) throw new Error(whistleRes.error.message);

  const combined = [
    ...(contactRes.data || []).map(m => ({
      ...m,
      name: m.first_name ? `${m.first_name} ${m.last_name || ''}`.trim() : m.name,
      contact: m.email || m.phone,
      _type: 'contact',
      typeLabel: 'Get in Touch'
    })),
    ...(whistleRes.data || []).map(m => ({
      ...m,
      contact: m.email || m.phone,
      _type: 'whistleblower',
      typeLabel: 'Whistleblower'
    }))
  ];

  combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return combined;
}
