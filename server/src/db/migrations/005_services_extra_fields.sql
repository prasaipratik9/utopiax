-- Extra display fields for services (keynotes, programs, retreats, xperiences).
-- Run in Supabase SQL editor, or via: npm run migrate (requires DATABASE_URL).

alter table public.services
  add column if not exists tag text,
  add column if not exists location text,
  add column if not exists status_label text,
  add column if not exists cta_label text;
