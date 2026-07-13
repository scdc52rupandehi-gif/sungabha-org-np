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

export async function createDonation(formData: FormData) {
  const supabase = await getSupabase();
  const data = Object.fromEntries(formData.entries());
  const { error } = await supabase.from('donations').insert(data);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/donations");
}

export async function updateDonation(id: string, formData: FormData) {
  const supabase = await getSupabase();
  const data = Object.fromEntries(formData.entries());
  const { error } = await supabase.from('donations').update(data).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/donations");
}

export async function deleteDonation(id: string) {
  const supabase = await getSupabase();
  const { error } = await supabase.from('donations').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/donations");
}
