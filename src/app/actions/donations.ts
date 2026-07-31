"use server";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";
import { sendNotificationEmail } from "@/lib/mail";

async function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function createDonation(formData: FormData) {
  try {
    const supabase = await getSupabase();
    const data = Object.fromEntries(formData.entries());
    const imageFile = formData.get('screenshot') as File | null;
    let screenshot_url = null;

    if (imageFile && imageFile.size > 0) {
      const ext = imageFile.name.split('.').pop();
      const fileName = `donations/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
      
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const { error: uploadError } = await supabase.storage.from('media').upload(fileName, buffer, {
        contentType: imageFile.type,
        upsert: false
      });

      if (uploadError) throw new Error(`Failed to upload screenshot: ${uploadError.message}`);
      
      const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(fileName);
      screenshot_url = publicUrlData.publicUrl;
    }

    const payload = {
      first_name: data.first_name,
      last_name: data.last_name,
      donor_name: `${data.first_name} ${data.last_name}`,
      email: data.email,
      phone: data.phone || null,
      amount: data.amount,
      purpose: data.purpose,
      message: data.message || null,
      payment_method: 'eSewa/Bank',
      screenshot_url: screenshot_url,
      status: 'pending' // Added status column tracking
    };
    
    const { error } = await supabase.from('donations').insert(payload);
    if (error) return { success: false, error: error.message };

    // Send email notification to Admin
    await sendNotificationEmail({
      type: 'New Donation',
      name: `${data.first_name} ${data.last_name}`,
      email: data.email as string,
      phone: data.phone as string,
      amount: data.amount as string,
      purpose: data.purpose as string,
      message: data.message as string,
    });

    // Send email acknowledgement to Donor (NOT the final certificate)
    await sendNotificationEmail({
      type: 'Donation Acknowledgement',
      name: `${data.first_name} ${data.last_name}`,
      email: data.email as string,
      amount: data.amount as string,
      purpose: data.purpose as string,
    });

    revalidatePath("/admin/donations");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message || String(e) };
  }
}

export async function verifyDonation(id: string) {
  try {
    const supabase = await getSupabase();
    
    // 1. Update status to verified
    const { error: updateError } = await supabase
      .from('donations')
      .update({ status: 'verified' })
      .eq('id', id);
      
    if (updateError) throw new Error(updateError.message);

    // 2. Fetch the donation details to send the certificate
    const { data: donation, error: fetchError } = await supabase
      .from('donations')
      .select('*')
      .eq('id', id)
      .single();
      
    if (fetchError || !donation) throw new Error(fetchError?.message || "Donation not found");

    // 3. Send the actual Certificate Receipt
    await sendNotificationEmail({
      type: 'Donation Receipt',
      name: donation.first_name ? `${donation.first_name} ${donation.last_name || ''}` : donation.donor_name || 'Valued Donor',
      email: donation.email as string,
      amount: donation.amount as string,
      purpose: donation.purpose as string,
    });

    revalidatePath("/admin/donations");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message || String(e) };
  }
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

export async function getDonations() {
  noStore();
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase.from('donations').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || String(error) };
  }
}
