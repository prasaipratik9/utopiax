-- Featured flag for Media page bento hero slot.
-- Run in Supabase SQL editor, or via: npm run migrate (requires DATABASE_URL).

alter table public.media
  add column if not exists is_featured boolean not null default false;
