/*
# Add phone and photo_url columns to jobs

1. Modified Tables
- `jobs`
  - `phone` (text, nullable) — contact phone number displayed on each job card
  - `photo_url` (text, nullable) — optional photo/image URL shown on the job card
2. Security
- No RLS policy changes; existing policies on `jobs` already allow anon/authenticated CRUD.
3. Notes
- Both columns are nullable so existing job rows are unaffected.
- Safe to re-run (uses ADD COLUMN IF NOT EXISTS).
*/

ALTER TABLE jobs
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS photo_url text;
