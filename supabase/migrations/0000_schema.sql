-- SCDC Complete Database Schema (PostgreSQL for Supabase)
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. Core Users & Roles
-- ==========================================
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'superadmin', 'editor'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id),
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 2. Projects & Programs
-- ==========================================
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Active', 'Completed', 'Upcoming')),
    start_date DATE,
    end_date DATE,
    budget VARCHAR(100),
    featured_image TEXT,
    objectives TEXT[],
    outcomes TEXT[],
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100), -- e.g., 'Education', 'Health'
    featured_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 3. Media & Content
-- ==========================================
CREATE TABLE news_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL CHECK (type IN ('News', 'Event', 'Notice', 'Tender')),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image TEXT,
    event_date TIMESTAMP WITH TIME ZONE,
    event_location VARCHAR(255),
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE media_library (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50) NOT NULL, -- 'image', 'video', 'document'
    uploaded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255),
    type VARCHAR(50) NOT NULL CHECK (type IN ('Photo', 'Video')),
    media_url TEXT NOT NULL,
    thumbnail_url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 4. Resources
-- ==========================================
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'Annual Report', 'Audit Report', 'Publication', 'General'
    file_url TEXT NOT NULL,
    published_year INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 5. Engagement & Forms
-- ==========================================
CREATE TABLE contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Unread',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE volunteers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    skills TEXT[],
    availability VARCHAR(100),
    resume_url TEXT,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donor_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'NPR',
    payment_method VARCHAR(50) NOT NULL, -- 'eSewa', 'Khalti', 'Bank Transfer', 'QR'
    transaction_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Pending',
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 6. Social Proof
-- ==========================================
CREATE TABLE partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    logo_url TEXT NOT NULL,
    website_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(255),
    message TEXT NOT NULL,
    avatar_url TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('Executive Committee', 'Staff')),
    experience VARCHAR(100),
    tenure VARCHAR(100),
    avatar_url TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- Row Level Security (RLS)
-- ==========================================
-- Example: Allow public read access to Projects, but only authenticated users can edit.
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on projects" 
ON projects FOR SELECT USING (true);

CREATE POLICY "Allow authenticated full access on projects" 
ON projects FOR ALL USING (auth.role() = 'authenticated');

-- Apply similar basic policies to all public tables
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on programs" ON programs FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access on programs" ON programs FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE news_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on news" ON news_events FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access on news" ON news_events FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access on gallery" ON gallery FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on team" ON team_members FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access on team" ON team_members FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on partners" ON partners FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access on partners" ON partners FOR ALL USING (auth.role() = 'authenticated');

-- For forms, allow public insert, but only auth read
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert on contact" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow auth read on contact" ON contact_messages FOR SELECT USING (auth.role() = 'authenticated');

ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert on volunteers" ON volunteers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow auth read on volunteers" ON volunteers FOR SELECT USING (auth.role() = 'authenticated');

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert on newsletter" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow auth read on newsletter" ON newsletter_subscribers FOR SELECT USING (auth.role() = 'authenticated');
