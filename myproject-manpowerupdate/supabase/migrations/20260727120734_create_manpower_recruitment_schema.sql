/*
# Manpower & Recruitment — full schema

1. Purpose
   Creates the complete data layer for a manpower/recruitment website:
   - Jobs (with full description, requirements, vacancies)
   - Job applications (applicant details + uploaded CV)
   - Contact messages from the contact form
   - Partners / owners (3 founder cards shown on the home page)
   - Company info (singleton row with address, map, contact details)

2. New Tables
   - `jobs`: job listings the admin can CRUD. Columns: id, title, company, location,
     type, category, salary, description, requirements (text[]), vacancies, is_active, created_at.
   - `applications`: a candidate's application for a job. Columns: id, job_id (fk -> jobs),
     name, email, phone, cover_letter, cv_file_path (storage path), cv_file_name, created_at.
   - `contacts`: messages submitted via the public contact form. Columns: id, name, email,
     phone, subject, message, created_at.
   - `partners`: the 3 founder/owner cards shown on the home page. Columns: id, name, title,
     bio, photo_url, display_order, created_at.
   - `company`: single row holding company-wide info (name, tagline, description, email,
     phone, address, map_embed_url). Columns: id, name, tagline, description, email, phone,
     address, map_embed_url, created_at.

3. Storage
   - Creates two public storage buckets: `cvs` (uploaded resumes) and `photos` (partner/owner photos).

4. Security
   - This is a single-tenant site with no user sign-in. All tables use RLS with
     `TO anon, authenticated` and `USING (true)` / `WITH CHECK (true)` because the data
     is intentionally public/shared and the frontend operates with the anon key.
   - Storage buckets are public so the anon client can upload CVs/photos and read them back.

5. Seed data
   - 6 dummy jobs with descriptions and requirements.
   - 3 partner/owner cards.
   - 1 company info row.
*/

-- ---------- jobs ----------
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company text DEFAULT '',
  location text DEFAULT '',
  type text DEFAULT 'Full-time',
  category text DEFAULT 'General',
  salary text DEFAULT '',
  description text DEFAULT '',
  requirements text[] DEFAULT '{}',
  vacancies integer DEFAULT 1,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_jobs" ON jobs;
CREATE POLICY "anon_select_jobs" ON jobs FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_jobs" ON jobs;
CREATE POLICY "anon_insert_jobs" ON jobs FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_jobs" ON jobs;
CREATE POLICY "anon_update_jobs" ON jobs FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_jobs" ON jobs;
CREATE POLICY "anon_delete_jobs" ON jobs FOR DELETE TO anon, authenticated USING (true);

-- ---------- applications ----------
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT '',
  cover_letter text DEFAULT '',
  cv_file_path text DEFAULT '',
  cv_file_name text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_applications" ON applications;
CREATE POLICY "anon_select_applications" ON applications FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_applications" ON applications;
CREATE POLICY "anon_insert_applications" ON applications FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_applications" ON applications;
CREATE POLICY "anon_update_applications" ON applications FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_applications" ON applications;
CREATE POLICY "anon_delete_applications" ON applications FOR DELETE TO anon, authenticated USING (true);

-- ---------- contacts ----------
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT '',
  subject text DEFAULT '',
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_contacts" ON contacts;
CREATE POLICY "anon_select_contacts" ON contacts FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_contacts" ON contacts;
CREATE POLICY "anon_insert_contacts" ON contacts FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_contacts" ON contacts;
CREATE POLICY "anon_delete_contacts" ON contacts FOR DELETE TO anon, authenticated USING (true);

-- ---------- partners ----------
CREATE TABLE IF NOT EXISTS partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text DEFAULT '',
  bio text DEFAULT '',
  photo_url text DEFAULT '',
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_partners" ON partners;
CREATE POLICY "anon_select_partners" ON partners FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_partners" ON partners;
CREATE POLICY "anon_insert_partners" ON partners FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_partners" ON partners;
CREATE POLICY "anon_update_partners" ON partners FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_partners" ON partners;
CREATE POLICY "anon_delete_partners" ON partners FOR DELETE TO anon, authenticated USING (true);

-- ---------- company ----------
CREATE TABLE IF NOT EXISTS company (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text DEFAULT 'Manpower Recruitment',
  tagline text DEFAULT '',
  description text DEFAULT '',
  email text DEFAULT '',
  phone text DEFAULT '',
  address text DEFAULT '',
  map_embed_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE company ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_company" ON company;
CREATE POLICY "anon_select_company" ON company FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_update_company" ON company;
CREATE POLICY "anon_update_company" ON company FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_insert_company" ON company;
CREATE POLICY "anon_insert_company" ON company FOR INSERT TO anon, authenticated WITH CHECK (true);

-- ---------- storage buckets ----------
INSERT INTO storage.buckets (id, name, public)
VALUES ('cvs', 'cvs', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- public storage policies for cvs
DROP POLICY IF EXISTS "anon_upload_cvs" ON storage.objects;
CREATE POLICY "anon_upload_cvs" ON storage.objects
  FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'cvs');
DROP POLICY IF EXISTS "anon_read_cvs" ON storage.objects;
CREATE POLICY "anon_read_cvs" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'cvs');

-- public storage policies for photos
DROP POLICY IF EXISTS "anon_upload_photos" ON storage.objects;
CREATE POLICY "anon_upload_photos" ON storage.objects
  FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'photos');
DROP POLICY IF EXISTS "anon_read_photos" ON storage.objects;
CREATE POLICY "anon_read_photos" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'photos');
DROP POLICY IF EXISTS "anon_update_photos" ON storage.objects;
CREATE POLICY "anon_update_photos" ON storage.objects
  FOR UPDATE TO anon, authenticated USING (bucket_id = 'photos') WITH CHECK (bucket_id = 'photos');

-- ---------- seed: company ----------
INSERT INTO company (name, tagline, description, email, phone, address, map_embed_url)
SELECT 'Manpower Recruitment', 'Connecting Talent with Opportunity',
'We are a full-service manpower and recruitment agency committed to bridging the gap between employers and skilled talent. With over 15 years of experience across industries, we provide reliable staffing solutions that help organizations grow and professionals thrive.',
'contact@manpower.com', '+91 98765 43210', 'Connaught Place, New Delhi, India 110001',
'https://www.google.com/maps?q=Connaught+Place+New+Delhi&output=embed'
WHERE NOT EXISTS (SELECT 1 FROM company);

-- ---------- seed: 3 partners ----------
INSERT INTO partners (name, title, bio, photo_url, display_order)
SELECT 'Rajesh Sharma', 'Founder & Managing Director',
'Rajesh founded the agency with a belief that the right opportunity can transform a life. With 15+ years in HR and staffing, he has helped hundreds of companies build strong teams.',
'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600', 1
WHERE NOT EXISTS (SELECT 1 FROM partners WHERE name = 'Rajesh Sharma');

INSERT INTO partners (name, title, bio, photo_url, display_order)
SELECT 'Priya Verma', 'Co-Founder & Head of Operations',
'Priya oversees daily operations and candidate screening. Her attention to detail ensures every placement is the right fit for both employer and candidate.',
'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600', 2
WHERE NOT EXISTS (SELECT 1 FROM partners WHERE name = 'Priya Verma');

INSERT INTO partners (name, title, bio, photo_url, display_order)
SELECT 'Amit Patel', 'Co-Founder & Head of Client Relations',
'Amit leads client partnerships and business development, building lasting relationships with companies across manufacturing, IT, and logistics.',
'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600', 3
WHERE NOT EXISTS (SELECT 1 FROM partners WHERE name = 'Amit Patel');

-- ---------- seed: 6 dummy jobs ----------
INSERT INTO jobs (title, company, location, type, category, salary, description, requirements, vacancies, is_active)
SELECT 'Senior Welder', 'TechFab Industries', 'Mumbai, MH', 'Full-time', 'Manufacturing',
'Rs 35,000 - 50,000 / month',
'We are hiring experienced welders for a leading fabrication company. Candidates will work on structural steel and pipe welding projects using MIG and TIG processes. This is a long-term role with overtime opportunities and medical benefits.',
ARRAY['3+ years welding experience', 'ITI certification in welding preferred', 'Ability to read engineering drawings', 'Physically fit for site work'], 5, true
WHERE NOT EXISTS (SELECT 1 FROM jobs WHERE title = 'Senior Welder');

INSERT INTO jobs (title, company, location, type, category, salary, description, requirements, vacancies, is_active)
SELECT 'Electrician', 'PowerLine Services', 'Pune, MH', 'Full-time', 'Electrical',
'Rs 28,000 - 40,000 / month',
'Responsible for installation, maintenance, and repair of electrical systems in commercial and industrial buildings. Must follow safety standards and work with high and low voltage systems.',
ARRAY['ITI Electrical certification', '2+ years experience', 'Knowledge of electrical safety codes', 'Wireman license preferred'], 4, true
WHERE NOT EXISTS (SELECT 1 FROM jobs WHERE title = 'Electrician');

INSERT INTO jobs (title, company, location, type, category, salary, description, requirements, vacancies, is_active)
SELECT 'Heavy Vehicle Driver', 'FastTrack Logistics', 'Delhi NCR', 'Full-time', 'Logistics',
'Rs 25,000 - 35,000 / month',
'Drive heavy goods vehicles (HMV) for interstate logistics routes. Candidates must have a valid heavy vehicle license and clean driving record. Accommodation provided on long routes.',
ARRAY['Valid HMV driving license', '3+ years heavy vehicle experience', 'Clean driving record', 'Able to work long routes'], 8, true
WHERE NOT EXISTS (SELECT 1 FROM jobs WHERE title = 'Heavy Vehicle Driver');

INSERT INTO jobs (title, company, location, type, category, salary, description, requirements, vacancies, is_active)
SELECT 'Site Supervisor', 'BuildWell Construction', 'Gurgaon, HR', 'Full-time', 'Construction',
'Rs 40,000 - 55,000 / month',
'Supervise daily construction site activities, coordinate with workers and subcontractors, ensure quality and safety compliance, and report progress to project manager. Strong leadership required.',
ARRAY['Diploma in Civil Engineering', '5+ years site experience', 'Leadership and team management skills', 'Knowledge of safety regulations'], 2, true
WHERE NOT EXISTS (SELECT 1 FROM jobs WHERE title = 'Site Supervisor');

INSERT INTO jobs (title, company, location, type, category, salary, description, requirements, vacancies, is_active)
SELECT 'AC Technician', 'CoolCare Services', 'Noida, UP', 'Full-time', 'Maintenance',
'Rs 22,000 - 32,000 / month',
'Install, service, and repair split and window AC units for residential and commercial clients. Handle gas charging, compressor replacement, and general maintenance. Company provides tools and uniform.',
ARRAY['2+ years AC repair experience', 'Knowledge of refrigeration cycle', 'Own two-wheeler preferred', 'Customer friendly attitude'], 6, true
WHERE NOT EXISTS (SELECT 1 FROM jobs WHERE title = 'AC Technician');

INSERT INTO jobs (title, company, location, type, category, salary, description, requirements, vacancies, is_active)
SELECT 'Accountant', 'PrimeTraders Pvt Ltd', 'New Delhi', 'Full-time', 'Finance',
'Rs 30,000 - 45,000 / month',
'Manage day-to-day accounting, GST filing, TDS, bank reconciliation, and payroll. Prepare monthly financial reports and assist with audits. Working knowledge of Tally Prime required.',
ARRAY['B.Com or M.Com', '3+ years accounting experience', 'Tally Prime proficiency', 'Knowledge of GST and TDS'], 1, true
WHERE NOT EXISTS (SELECT 1 FROM jobs WHERE title = 'Accountant');
