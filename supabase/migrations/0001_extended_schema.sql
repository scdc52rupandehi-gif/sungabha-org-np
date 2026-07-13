-- SCDC Extended Database Schema (Phase 2 Additions)

-- ==========================================
-- 1. Permissions & RBAC
-- ==========================================
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL, -- e.g., 'create_projects', 'delete_users'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE role_permissions (
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (role_id, permission_id)
);

-- ==========================================
-- 2. SEO & Website Settings
-- ==========================================
CREATE TABLE seo_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_route VARCHAR(255) UNIQUE NOT NULL, -- e.g., '/', '/about'
    meta_title VARCHAR(255) NOT NULL,
    meta_description TEXT,
    meta_keywords TEXT,
    og_image TEXT,
    canonical_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE website_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    physical_address TEXT,
    facebook_url TEXT,
    twitter_url TEXT,
    instagram_url TEXT,
    linkedin_url TEXT,
    youtube_url TEXT,
    logo_light TEXT,
    logo_dark TEXT,
    favicon TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 3. Audit Logs
-- ==========================================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- e.g., 'UPDATE_PROJECT', 'DELETE_USER'
    entity_type VARCHAR(100) NOT NULL, -- e.g., 'projects', 'users'
    entity_id UUID,
    details JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- Row Level Security (RLS)
-- ==========================================

ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on permissions" ON permissions FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access on permissions" ON permissions FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on role_permissions" ON role_permissions FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access on role_permissions" ON role_permissions FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on seo_settings" ON seo_settings FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access on seo_settings" ON seo_settings FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on website_settings" ON website_settings FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access on website_settings" ON website_settings FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
-- Audit logs should only be readable by Super Admins ideally, but for now authenticated users
CREATE POLICY "Allow auth read on audit_logs" ON audit_logs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow auth insert on audit_logs" ON audit_logs FOR INSERT WITH CHECK (auth.role() = 'authenticated');

