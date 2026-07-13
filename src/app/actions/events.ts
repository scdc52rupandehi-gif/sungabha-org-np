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

export async function createEvent(formData: FormData) {
  const supabase = await getSupabase();
  const data = Object.fromEntries(formData.entries());
  const { error } = await supabase.from('news_events').insert(data);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/events");
}

export async function updateEvent(id: string, formData: FormData) {
  const supabase = await getSupabase();
  const data = Object.fromEntries(formData.entries());
  const { error } = await supabase.from('news_events').update(data).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/events");
}

export async function deleteEvent(id: string) {
  const supabase = await getSupabase();
  const { error } = await supabase.from('news_events').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/events");
}
