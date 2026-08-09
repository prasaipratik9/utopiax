-- UtopiaX Week 2 schema (run in Supabase SQL editor)
-- Stores CMS content as JSON + admin users for JWT login

create table if not exists public.site_content (
  id integer primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by text
);

create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);

-- Optional: lock down for anon clients (API uses service role key)
alter table public.site_content enable row level security;
alter table public.admins enable row level security;

-- No public policies on purpose — Express uses the service role key.
