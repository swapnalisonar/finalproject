-- Run this migration in the Supabase SQL Editor before production deployment.
-- It protects applicant details, contact messages, and CV files from public reads.

ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS phone text;

-- Jobs remain publicly visible only when active. Admin users can see all jobs.
DROP POLICY IF EXISTS "anon_select_jobs" ON public.jobs;
DROP POLICY IF EXISTS "anon_insert_jobs" ON public.jobs;
DROP POLICY IF EXISTS "anon_update_jobs" ON public.jobs;
DROP POLICY IF EXISTS "anon_delete_jobs" ON public.jobs;
CREATE POLICY "public_read_active_jobs" ON public.jobs FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');
CREATE POLICY "admins_manage_jobs" ON public.jobs FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Anyone may submit an application; only an authenticated admin may read or delete it.
DROP POLICY IF EXISTS "anon_select_applications" ON public.applications;
DROP POLICY IF EXISTS "anon_insert_applications" ON public.applications;
DROP POLICY IF EXISTS "anon_update_applications" ON public.applications;
DROP POLICY IF EXISTS "anon_delete_applications" ON public.applications;
CREATE POLICY "public_submit_applications" ON public.applications FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins_read_applications" ON public.applications FOR SELECT TO authenticated USING (true);
CREATE POLICY "admins_delete_applications" ON public.applications FOR DELETE TO authenticated USING (true);

-- Anyone may submit a contact message; only an authenticated admin may read or delete it.
DROP POLICY IF EXISTS "anon_select_contacts" ON public.contacts;
DROP POLICY IF EXISTS "anon_insert_contacts" ON public.contacts;
DROP POLICY IF EXISTS "anon_delete_contacts" ON public.contacts;
CREATE POLICY "public_submit_contacts" ON public.contacts FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins_read_contacts" ON public.contacts FOR SELECT TO authenticated USING (true);
CREATE POLICY "admins_delete_contacts" ON public.contacts FOR DELETE TO authenticated USING (true);

-- Public pages may read company/team information. Only an authenticated admin may change it.
DROP POLICY IF EXISTS "anon_select_partners" ON public.partners;
DROP POLICY IF EXISTS "anon_insert_partners" ON public.partners;
DROP POLICY IF EXISTS "anon_update_partners" ON public.partners;
DROP POLICY IF EXISTS "anon_delete_partners" ON public.partners;
CREATE POLICY "public_read_partners" ON public.partners FOR SELECT USING (true);
CREATE POLICY "admins_manage_partners" ON public.partners FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_select_company" ON public.company;
DROP POLICY IF EXISTS "anon_update_company" ON public.company;
DROP POLICY IF EXISTS "anon_insert_company" ON public.company;
CREATE POLICY "public_read_company" ON public.company FOR SELECT USING (true);
CREATE POLICY "admins_manage_company" ON public.company FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- CVs are private: applicants can upload; only an authenticated admin can download/read.
UPDATE storage.buckets SET public = false WHERE id = 'cvs';
DROP POLICY IF EXISTS "anon_upload_cvs" ON storage.objects;
DROP POLICY IF EXISTS "anon_read_cvs" ON storage.objects;
CREATE POLICY "public_upload_cvs" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'cvs');
CREATE POLICY "admins_read_cvs" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'cvs');

-- Team photos remain public, but only an authenticated admin can upload or alter them.
DROP POLICY IF EXISTS "anon_upload_photos" ON storage.objects;
DROP POLICY IF EXISTS "anon_update_photos" ON storage.objects;
CREATE POLICY "admins_upload_photos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'photos');
CREATE POLICY "admins_update_photos" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'photos') WITH CHECK (bucket_id = 'photos');
