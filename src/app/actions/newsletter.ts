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

export async function createSubscriber(formData: FormData) {
  const supabase = await getSupabase();
  const data = Object.fromEntries(formData.entries());
  const { error } = await supabase.from('newsletter_subscribers').insert(data);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/newsletter");
}

export async function updateSubscriber(id: string, formData: FormData) {
  const supabase = await getSupabase();
  const data = Object.fromEntries(formData.entries());
  const { error } = await supabase.from('newsletter_subscribers').update(data).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/newsletter");
}

export async function deleteSubscriber(id: string) {
  const supabase = await getSupabase();
  const { error } = await supabase.from('newsletter_subscribers').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/newsletter");
}
