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

export async function createWhistleblowerMessage(formData: FormData) {
  const supabase = getAdminSupabase();
  const data = Object.fromEntries(formData.entries());
  
  const payload = {
    name: data.name || 'Anonymous',
    email: data.email || null,
    phone: data.phone || null,
    message: data.message,
  };

  const { error } = await supabase.from('whistleblower_messages').insert(payload);
  if (error) throw new Error(error.message);
  
  // Send email notification in the background
  await sendNotificationEmail({
    type: 'Whistleblower',
    name: payload.name as string,
    email: payload.email as string,
    phone: payload.phone as string,
    message: payload.message as string,
  });

  revalidatePath("/admin/whistleblower");
}
