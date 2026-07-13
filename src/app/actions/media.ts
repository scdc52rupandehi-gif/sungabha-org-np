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

export async function deleteMediaFile(path: string) {
  const supabase = await getSupabase();
  const { error } = await supabase.storage.from("media").remove([path]);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/media-library");
}
