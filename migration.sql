-- Complete Migration for Volunteer Management System (Safe to run multiple times)

DO $$ 
BEGIN 
    -- 1. ADD MISSING COLUMNS TO VOLUNTEERS TABLE
    
    BEGIN
        ALTER TABLE public.volunteers ADD COLUMN reference_id VARCHAR(50) UNIQUE;
    EXCEPTION WHEN duplicate_column THEN END;

    BEGIN
        ALTER TABLE public.volunteers ADD COLUMN gender VARCHAR(50);
    EXCEPTION WHEN duplicate_column THEN END;

    BEGIN
        ALTER TABLE public.volunteers ADD COLUMN dob DATE;
    EXCEPTION WHEN duplicate_column THEN END;

    BEGIN
        ALTER TABLE public.volunteers ADD COLUMN citizenship_number VARCHAR(100);
    EXCEPTION WHEN duplicate_column THEN END;

    BEGIN
        ALTER TABLE public.volunteers ADD COLUMN province VARCHAR(100);
    EXCEPTION WHEN duplicate_column THEN END;

    BEGIN
        ALTER TABLE public.volunteers ADD COLUMN district VARCHAR(100);
    EXCEPTION WHEN duplicate_column THEN END;

    BEGIN
        ALTER TABLE public.volunteers ADD COLUMN municipality VARCHAR(100);
    EXCEPTION WHEN duplicate_column THEN END;

    BEGIN
        ALTER TABLE public.volunteers ADD COLUMN ward VARCHAR(50);
    EXCEPTION WHEN duplicate_column THEN END;

    BEGIN
        ALTER TABLE public.volunteers ADD COLUMN emergency_contact_name VARCHAR(255);
    EXCEPTION WHEN duplicate_column THEN END;

    BEGIN
        ALTER TABLE public.volunteers ADD COLUMN emergency_relationship VARCHAR(100);
    EXCEPTION WHEN duplicate_column THEN END;

    BEGIN
        ALTER TABLE public.volunteers ADD COLUMN emergency_phone VARCHAR(50);
    EXCEPTION WHEN duplicate_column THEN END;

    BEGIN
        ALTER TABLE public.volunteers ADD COLUMN blood_group VARCHAR(10);
    EXCEPTION WHEN duplicate_column THEN END;

    BEGIN
        ALTER TABLE public.volunteers ADD COLUMN education_level VARCHAR(100);
    EXCEPTION WHEN duplicate_column THEN END;

    BEGIN
        ALTER TABLE public.volunteers ADD COLUMN occupation VARCHAR(100);
    EXCEPTION WHEN duplicate_column THEN END;

    BEGIN
        ALTER TABLE public.volunteers ADD COLUMN languages JSONB;
    EXCEPTION WHEN duplicate_column THEN END;

    BEGIN
        ALTER TABLE public.volunteers ADD COLUMN previous_experience BOOLEAN DEFAULT false;
    EXCEPTION WHEN duplicate_column THEN END;

    BEGIN
        ALTER TABLE public.volunteers ADD COLUMN previous_organization VARCHAR(255);
    EXCEPTION WHEN duplicate_column THEN END;

    BEGIN
        ALTER TABLE public.volunteers ADD COLUMN volunteer_duration VARCHAR(100);
    EXCEPTION WHEN duplicate_column THEN END;

    BEGIN
        ALTER TABLE public.volunteers ADD COLUMN previous_role VARCHAR(255);
    EXCEPTION WHEN duplicate_column THEN END;

    BEGIN
        -- Alter skills from TEXT[] to JSONB if needed, or leave as is if it works. 
        -- For Next.js to insert arrays safely, JSONB is preferred. 
        ALTER TABLE public.volunteers DROP COLUMN IF EXISTS skills;
        ALTER TABLE public.volunteers ADD COLUMN skills JSONB;
    EXCEPTION WHEN undefined_column THEN END;

    BEGIN
        ALTER TABLE public.volunteers ADD COLUMN interests JSONB;
    EXCEPTION WHEN duplicate_column THEN END;

    BEGIN
        ALTER TABLE public.volunteers ADD COLUMN available_days JSONB;
    EXCEPTION WHEN duplicate_column THEN END;

    BEGIN
        ALTER TABLE public.volunteers ADD COLUMN available_time JSONB;
    EXCEPTION WHEN duplicate_column THEN END;

    BEGIN
        ALTER TABLE public.volunteers ADD COLUMN motivation TEXT;
    EXCEPTION WHEN duplicate_column THEN END;

    BEGIN
        ALTER TABLE public.volunteers ADD COLUMN medical_conditions TEXT;
    EXCEPTION WHEN duplicate_column THEN END;

    BEGIN
        ALTER TABLE public.volunteers ADD COLUMN photo_url TEXT;
    EXCEPTION WHEN duplicate_column THEN END;

    BEGIN
        ALTER TABLE public.volunteers ADD COLUMN cv_url TEXT;
    EXCEPTION WHEN duplicate_column THEN END;

    BEGIN
        ALTER TABLE public.volunteers ADD COLUMN admin_notes TEXT;
    EXCEPTION WHEN duplicate_column THEN END;

    BEGIN
        ALTER TABLE public.volunteers ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    EXCEPTION WHEN duplicate_column THEN END;

END $$;


-- ==========================================
-- 2. CREATE VOLUNTEER TIMELINE TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.volunteer_timeline (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    volunteer_id UUID REFERENCES public.volunteers(id) ON DELETE CASCADE,
    action_title VARCHAR(255) NOT NULL,
    action_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 3. CREATE VOLUNTEER NOTES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.volunteer_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    volunteer_id UUID REFERENCES public.volunteers(id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ==========================================
-- 4. REFERENCE ID GENERATION TRIGGER
-- ==========================================
-- Function to generate sequential VOL-XXXX-XXXX ID
CREATE OR REPLACE FUNCTION generate_volunteer_reference_id()
RETURNS TRIGGER AS $$
DECLARE
    next_num INT;
    year_str VARCHAR(4);
BEGIN
    year_str := to_char(CURRENT_DATE, 'YYYY');
    
    -- Count existing records for this year
    SELECT COUNT(*) + 1 INTO next_num
    FROM public.volunteers 
    WHERE reference_id LIKE 'VOL-' || year_str || '-%';

    NEW.reference_id := 'VOL-' || year_str || '-' || LPAD(next_num::text, 4, '0');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_volunteer_reference_id ON public.volunteers;
CREATE TRIGGER set_volunteer_reference_id
BEFORE INSERT ON public.volunteers
FOR EACH ROW
WHEN (NEW.reference_id IS NULL)
EXECUTE FUNCTION generate_volunteer_reference_id();


-- ==========================================
-- 5. RLS POLICIES FOR NEW TABLES
-- ==========================================
ALTER TABLE public.volunteer_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow auth full access on volunteer_timeline" ON public.volunteer_timeline;
CREATE POLICY "Allow auth full access on volunteer_timeline" ON public.volunteer_timeline FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow auth full access on volunteer_notes" ON public.volunteer_notes;
CREATE POLICY "Allow auth full access on volunteer_notes" ON public.volunteer_notes FOR ALL USING (auth.role() = 'authenticated');

-- Ensure public can insert into volunteers, and auth can do all
DROP POLICY IF EXISTS "Allow public insert on volunteers" ON public.volunteers;
CREATE POLICY "Allow public insert on volunteers" ON public.volunteers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow auth read on volunteers" ON public.volunteers;
DROP POLICY IF EXISTS "Allow auth all on volunteers" ON public.volunteers;
CREATE POLICY "Allow auth all on volunteers" ON public.volunteers FOR ALL USING (auth.role() = 'authenticated');


-- ==========================================
-- 6. STORAGE BUCKET FOR VOLUNTEER DOCUMENTS
-- ==========================================
-- We use SQL to insert the bucket. If it exists, it ignores.
INSERT INTO storage.buckets (id, name, public) 
VALUES ('volunteer-documents', 'volunteer-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
DROP POLICY IF EXISTS "Allow public uploads to volunteer-documents" ON storage.objects;
CREATE POLICY "Allow public uploads to volunteer-documents" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'volunteer-documents');

DROP POLICY IF EXISTS "Allow public reads from volunteer-documents" ON storage.objects;
CREATE POLICY "Allow public reads from volunteer-documents" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'volunteer-documents');

DROP POLICY IF EXISTS "Allow admin delete from volunteer-documents" ON storage.objects;
CREATE POLICY "Allow admin delete from volunteer-documents" 
ON storage.objects FOR DELETE 
USING (auth.role() = 'authenticated' AND bucket_id = 'volunteer-documents');
