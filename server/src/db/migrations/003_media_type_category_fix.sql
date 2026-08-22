-- 003_media_type_category_fix.sql
-- Restore podcast/press types and free-text category.
-- Safe to re-run (DROP IF EXISTS). Table may be empty.

alter table public.media drop constraint if exists media_type_check;
alter table public.media
  add constraint media_type_check
  check (type in ('video', 'article', 'podcast', 'press', 'image'));

alter table public.media drop constraint if exists media_category_check;
