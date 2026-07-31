/*
# Add phone column to partners

1. Modified Tables
- `partners`
  - `phone` (text, nullable) — contact phone number displayed on each director/partner card
2. Security
- No RLS policy changes; existing policies on `partners` already allow anon/authenticated CRUD.
3. Notes
- Nullable so existing partner rows are unaffected.
- Safe to re-run (uses ADD COLUMN IF NOT EXISTS).
*/

ALTER TABLE partners
  ADD COLUMN IF NOT EXISTS phone text;
