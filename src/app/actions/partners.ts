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

export async function createPartner(formData: FormData) {
  const supabase = await getSupabase();
  const data = Object.fromEntries(formData.entries());
  const { error } = await supabase.from('partners').insert(data);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/partners");
}

export async function updatePartner(id: string, formData: FormData) {
  const supabase = await getSupabase();
  const data = Object.fromEntries(formData.entries());
  const { error } = await supabase.from('partners').update(data).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/partners");
}

export async function deletePartner(id: string) {
  const supabase = await getSupabase();
  const { error } = await supabase.from('partners').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/partners");
}
