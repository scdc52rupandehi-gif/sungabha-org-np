import { createClient } from '@/lib/supabase/client';

// ==========================================
// Projects API
// ==========================================
export async function getProjects(status?: 'Active' | 'Completed' | 'Upcoming') {
  let query = supabase.from('projects').select('*').order('created_at', { ascending: false });
  if (status) {
    query = query.eq('status', status);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getProjectBySlug(slug: string) {
  const { data, error } = await supabase.from('projects').select('*').eq('slug', slug).single();
  if (error) throw error;
  return data;
}

// ==========================================
// News & Events API
// ==========================================
export async function getNewsEvents(type?: 'News' | 'Event' | 'Notice' | 'Tender') {
  let query = supabase.from('news_events').select('*').eq('is_published', true).order('created_at', { ascending: false });
  if (type) {
    query = query.eq('type', type);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// ==========================================
// Gallery API
// ==========================================
export async function getGallery(type?: 'Photo' | 'Video') {
  let query = supabase.from('gallery').select('*').order('created_at', { ascending: false });
  if (type) {
    query = query.eq('type', type);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// ==========================================
// Team Members API
// ==========================================
export async function getTeamMembers(type?: 'Executive Committee' | 'Staff') {
  let query = supabase.from('team_members').select('*').order('display_order', { ascending: true });
  if (type) {
    query = query.eq('type', type);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// ==========================================
// Forms (Donations, Contact, Volunteer)
// ==========================================
export async function submitContactForm(formData: { first_name: string; last_name: string; email: string; subject: string; message: string }) {
  const { data, error } = await supabase.from('contact_messages').insert([formData]);
  if (error) throw error;
  return data;
}

export async function submitVolunteerForm(formData: { full_name: string; email: string; phone: string; address: string; skills: string[]; availability: string }) {
  const { data, error } = await supabase.from('volunteers').insert([formData]);
  if (error) throw error;
  return data;
}

const supabase = createClient();