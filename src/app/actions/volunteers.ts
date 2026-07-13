"use server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { sendNotificationEmail } from "@/lib/mail";

async function getSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() } } }
  );
}

export async function createVolunteer(payload: any) {
  const supabase = await getSupabase();
  
  // Security Check: Prevent Duplicate Candidates by Email or Phone
  const { data: existingVolunteer } = await supabase
    .from('volunteers')
    .select('id')
    .or(`email.eq.${payload.email},phone.eq.${payload.phone}`)
    .maybeSingle();

  if (existingVolunteer) {
    throw new Error("An application with this Mobile Number or Email Address already exists.");
  }

  const { data, error } = await supabase.from('volunteers').insert(payload).select().single();
  
  if (error) throw new Error(error.message);
  
  // Create an initial timeline entry
  if (data) {
    await supabase.from('volunteer_timeline').insert({
      volunteer_id: data.id,
      action_title: "Application Submitted",
      action_description: "The volunteer application was successfully submitted via the public portal."
    });

    // Send Email to Applicant
    try {
      await sendNotificationEmail({
        type: "Volunteer",
        name: data.full_name,
        email: data.email,
        subject: "Volunteer Application Received Successfully",
        message: `Thank you for your interest in joining SCDC. Your volunteer application has been successfully received. \n\nReference ID: ${data.reference_id}\n\nOur team will review your application and contact you shortly.`
      });
      
      // Send Email to Admin
      await sendNotificationEmail({
        type: "System Alert",
        name: "Admin",
        email: "scdc52rupandehi@gmail.com",
        subject: "New Volunteer Application Received",
        message: `A new volunteer application was submitted by ${data.full_name}. Reference ID: ${data.reference_id}. District: ${data.district}.`
      });
    } catch (e) {
      console.error("Email notification failed:", e);
      // Do not block submission on email failure
    }
  }

  revalidatePath("/admin/volunteers");
  return data;
}

export async function updateVolunteerStatus(id: string, status: string, adminNotes?: string) {
  const supabase = await getSupabase();
  const updatePayload: any = { status };
  
  if (adminNotes) {
    updatePayload.admin_notes = adminNotes;
  }
  
  const { data, error } = await supabase.from('volunteers').update(updatePayload).eq('id', id).select().single();
  if (error) throw new Error(error.message);

  // Add timeline entry
  await supabase.from('volunteer_timeline').insert({
    volunteer_id: id,
    action_title: `Status changed to ${status}`,
    action_description: adminNotes ? `Admin Notes: ${adminNotes}` : `Status updated by Admin.`
  });

  // If approved, send approval email
  if (status === "Approved" && data) {
     try {
       await sendNotificationEmail({
         type: "Volunteer Approved",
         name: data.full_name,
         email: data.email,
         subject: "Congratulations! Your volunteer application has been approved",
         message: `Dear ${data.full_name},\n\nWe are thrilled to inform you that your volunteer application has been approved. Welcome to the SCDC team!`
       });
     } catch (e) {
       console.error("Approval email failed:", e);
     }
  }

  revalidatePath(`/admin/volunteers/${id}`);
  revalidatePath("/admin/volunteers");
  revalidatePath("/our-volunteers");
}

export async function addVolunteerNote(id: string, note: string) {
  const supabase = await getSupabase();
  const { error } = await supabase.from('volunteer_notes').insert({
    volunteer_id: id,
    note: note
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/volunteers/${id}`);
}

export async function updateVolunteer(id: string, formData: FormData) {
  const supabase = await getSupabase();
  const data = Object.fromEntries(formData.entries());
  const { error } = await supabase.from('volunteers').update(data).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/volunteers/${id}`);
  revalidatePath("/admin/volunteers");
}

export async function deleteVolunteer(id: string) {
  const supabase = await getSupabase();
  const { error } = await supabase.from('volunteers').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/volunteers");
}
