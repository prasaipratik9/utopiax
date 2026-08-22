-- 002_media_content.sql
-- Adds content fields to media and tightens type CHECK.
-- Run in Supabase SQL editor, or via: npm run migrate (requires DATABASE_URL).
-- Safe to re-run (IF NOT EXISTS / DROP IF EXISTS).

-- Remap legacy types before replacing the CHECK constraint
update public.media set type = 'article' where type = 'press';
update public.media set type = 'video' where type = 'podcast';

alter table public.media
  add column if not exists category text,
  add column if not exists content text,
  add column if not exists excerpt text,
  add column if not exists slug text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'media_category_check'
  ) then
    alter table public.media
      add constraint media_category_check
      check (category is null or category in ('openmindx', 'ideationworx', 'lumierex'));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'media_slug_key'
  ) then
    alter table public.media add constraint media_slug_key unique (slug);
  end if;
end $$;

alter table public.media drop constraint if exists media_type_check;
alter table public.media
  add constraint media_type_check
  check (type in ('image', 'video', 'document', 'article'));

create index if not exists idx_media_category on public.media (category);
create index if not exists idx_media_slug on public.media (slug);
