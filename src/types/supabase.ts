export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      roles: {
        Row: { id: string; name: string; description: string | null; created_at: string }
        Insert: { id?: string; name: string; description?: string | null; created_at?: string }
        Update: { id?: string; name?: string; description?: string | null; created_at?: string }
      }
      user_profiles: {
        Row: { id: string; role_id: string | null; full_name: string; avatar_url: string | null; is_active: boolean; created_at: string; updated_at: string }
        Insert: { id: string; role_id?: string | null; full_name: string; avatar_url?: string | null; is_active?: boolean; created_at?: string; updated_at?: string }
        Update: { id?: string; role_id?: string | null; full_name?: string; avatar_url?: string | null; is_active?: boolean; created_at?: string; updated_at?: string }
      }
      projects: {
        Row: { id: string; title: string; slug: string; description: string; status: string; start_date: string | null; end_date: string | null; budget: string | null; featured_image: string | null; objectives: string[] | null; outcomes: string[] | null; is_featured: boolean; created_at: string; updated_at: string }
        Insert: { id?: string; title: string; slug: string; description: string; status: string; start_date?: string | null; end_date?: string | null; budget?: string | null; featured_image?: string | null; objectives?: string[] | null; outcomes?: string[] | null; is_featured?: boolean; created_at?: string; updated_at?: string }
        Update: { id?: string; title?: string; slug?: string; description?: string; status?: string; start_date?: string | null; end_date?: string | null; budget?: string | null; featured_image?: string | null; objectives?: string[] | null; outcomes?: string[] | null; is_featured?: boolean; created_at?: string; updated_at?: string }
      }
      programs: {
        Row: { id: string; title: string; slug: string; description: string; category: string | null; featured_image: string | null; created_at: string; updated_at: string }
        Insert: { id?: string; title: string; slug: string; description: string; category?: string | null; featured_image?: string | null; created_at?: string; updated_at?: string }
        Update: { id?: string; title?: string; slug?: string; description?: string; category?: string | null; featured_image?: string | null; created_at?: string; updated_at?: string }
      }
      news_events: {
        Row: { id: string; type: string; title: string; slug: string; content: string; excerpt: string | null; featured_image: string | null; event_date: string | null; event_location: string | null; is_published: boolean; created_at: string; updated_at: string }
        Insert: { id?: string; type: string; title: string; slug: string; content: string; excerpt?: string | null; featured_image?: string | null; event_date?: string | null; event_location?: string | null; is_published?: boolean; created_at?: string; updated_at?: string }
        Update: { id?: string; type?: string; title?: string; slug?: string; content?: string; excerpt?: string | null; featured_image?: string | null; event_date?: string | null; event_location?: string | null; is_published?: boolean; created_at?: string; updated_at?: string }
      }
      media_library: {
        Row: { id: string; file_name: string; file_url: string; file_type: string; uploaded_by: string | null; created_at: string }
        Insert: { id?: string; file_name: string; file_url: string; file_type: string; uploaded_by?: string | null; created_at?: string }
        Update: { id?: string; file_name?: string; file_url?: string; file_type?: string; uploaded_by?: string | null; created_at?: string }
      }
      gallery: {
        Row: { id: string; title: string | null; type: string; media_url: string; thumbnail_url: string | null; description: string | null; created_at: string }
        Insert: { id?: string; title?: string | null; type: string; media_url: string; thumbnail_url?: string | null; description?: string | null; created_at?: string }
        Update: { id?: string; title?: string | null; type?: string; media_url?: string; thumbnail_url?: string | null; description?: string | null; created_at?: string }
      }
      documents: {
        Row: { id: string; title: string; category: string; file_url: string; published_year: number | null; created_at: string }
        Insert: { id?: string; title: string; category: string; file_url: string; published_year?: number | null; created_at?: string }
        Update: { id?: string; title?: string; category?: string; file_url?: string; published_year?: number | null; created_at?: string }
      }
      contact_messages: {
        Row: { id: string; first_name: string; last_name: string; email: string; subject: string | null; message: string; status: string; created_at: string }
        Insert: { id?: string; first_name: string; last_name: string; email: string; subject?: string | null; message: string; status?: string; created_at?: string }
        Update: { id?: string; first_name?: string; last_name?: string; email?: string; subject?: string | null; message?: string; status?: string; created_at?: string }
      }
      volunteers: {
        Row: { id: string; full_name: string; email: string; phone: string | null; address: string | null; skills: string[] | null; availability: string | null; resume_url: string | null; status: string; created_at: string }
        Insert: { id?: string; full_name: string; email: string; phone?: string | null; address?: string | null; skills?: string[] | null; availability?: string | null; resume_url?: string | null; status?: string; created_at?: string }
        Update: { id?: string; full_name?: string; email?: string; phone?: string | null; address?: string | null; skills?: string[] | null; availability?: string | null; resume_url?: string | null; status?: string; created_at?: string }
      }
      donations: {
        Row: { id: string; donor_name: string; email: string | null; amount: number; currency: string; payment_method: string; transaction_id: string | null; status: string; is_anonymous: boolean; created_at: string }
        Insert: { id?: string; donor_name: string; email?: string | null; amount: number; currency?: string; payment_method: string; transaction_id?: string | null; status?: string; is_anonymous?: boolean; created_at?: string }
        Update: { id?: string; donor_name?: string; email?: string | null; amount?: number; currency?: string; payment_method?: string; transaction_id?: string | null; status?: string; is_anonymous?: boolean; created_at?: string }
      }
      newsletter_subscribers: {
        Row: { id: string; email: string; is_active: boolean; created_at: string }
        Insert: { id?: string; email: string; is_active?: boolean; created_at?: string }
        Update: { id?: string; email?: string; is_active?: boolean; created_at?: string }
      }
      partners: {
        Row: { id: string; name: string; logo_url: string; website_url: string | null; is_active: boolean; created_at: string }
        Insert: { id?: string; name: string; logo_url: string; website_url?: string | null; is_active?: boolean; created_at?: string }
        Update: { id?: string; name?: string; logo_url?: string; website_url?: string | null; is_active?: boolean; created_at?: string }
      }
      testimonials: {
        Row: { id: string; name: string; designation: string | null; message: string; avatar_url: string | null; is_approved: boolean; created_at: string }
        Insert: { id?: string; name: string; designation?: string | null; message: string; avatar_url?: string | null; is_approved?: boolean; created_at?: string }
        Update: { id?: string; name?: string; designation?: string | null; message?: string; avatar_url?: string | null; is_approved?: boolean; created_at?: string }
      }
      permissions: {
        Row: { id: string; name: string; description: string | null; created_at: string }
        Insert: { id?: string; name: string; description?: string | null; created_at?: string }
        Update: { id?: string; name?: string; description?: string | null; created_at?: string }
      }
      seo_settings: {
        Row: { id: string; page_route: string; meta_title: string; meta_description: string | null; meta_keywords: string | null; og_image: string | null; canonical_url: string | null; is_active: boolean; created_at: string; updated_at: string }
        Insert: { id?: string; page_route: string; meta_title: string; meta_description?: string | null; meta_keywords?: string | null; og_image?: string | null; canonical_url?: string | null; is_active?: boolean; created_at?: string; updated_at?: string }
        Update: { id?: string; page_route?: string; meta_title?: string; meta_description?: string | null; meta_keywords?: string | null; og_image?: string | null; canonical_url?: string | null; is_active?: boolean; created_at?: string; updated_at?: string }
      }
      website_settings: {
        Row: { id: string; site_name: string; contact_email: string | null; contact_phone: string | null; physical_address: string | null; facebook_url: string | null; twitter_url: string | null; instagram_url: string | null; linkedin_url: string | null; youtube_url: string | null; logo_light: string | null; logo_dark: string | null; favicon: string | null; updated_at: string }
        Insert: { id?: string; site_name: string; contact_email?: string | null; contact_phone?: string | null; physical_address?: string | null; facebook_url?: string | null; twitter_url?: string | null; instagram_url?: string | null; linkedin_url?: string | null; youtube_url?: string | null; logo_light?: string | null; logo_dark?: string | null; favicon?: string | null; updated_at?: string }
        Update: { id?: string; site_name?: string; contact_email?: string | null; contact_phone?: string | null; physical_address?: string | null; facebook_url?: string | null; twitter_url?: string | null; instagram_url?: string | null; linkedin_url?: string | null; youtube_url?: string | null; logo_light?: string | null; logo_dark?: string | null; favicon?: string | null; updated_at?: string }
      }
      audit_logs: {
        Row: { id: string; user_id: string | null; action: string; entity_type: string; entity_id: string | null; details: Json | null; ip_address: string | null; user_agent: string | null; created_at: string }
        Insert: { id?: string; user_id?: string | null; action: string; entity_type: string; entity_id?: string | null; details?: Json | null; ip_address?: string | null; user_agent?: string | null; created_at?: string }
        Update: { id?: string; user_id?: string | null; action?: string; entity_type?: string; entity_id?: string | null; details?: Json | null; ip_address?: string | null; user_agent?: string | null; created_at?: string }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
