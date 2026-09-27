create extension if not exists pgcrypto;

create table if not exists public.media_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text default '',
  kind text not null check (kind in ('video', 'image')),
  source text not null check (source in ('local', 'upload', 'youtube', 'facebook')),
  url text not null,
  thumbnail_url text default '',
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.media_items enable row level security;

create policy "Public can read published media"
on public.media_items for select
to anon
using (published = true);

create policy "Authenticated admins can read media"
on public.media_items for select
to authenticated
using (true);

create policy "Authenticated admins can add media"
on public.media_items for insert
to authenticated
with check (true);

create policy "Authenticated admins can update media"
on public.media_items for update
to authenticated
using (true)
with check (true);

create policy "Authenticated admins can delete media"
on public.media_items for delete
to authenticated
using (true);

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

create policy "Public can view media files"
on storage.objects for select
to public
using (bucket_id = 'media');

create policy "Authenticated admins can upload media files"
on storage.objects for insert
to authenticated
with check (bucket_id = 'media');

create policy "Authenticated admins can update media files"
on storage.objects for update
to authenticated
using (bucket_id = 'media')
with check (bucket_id = 'media');

create policy "Authenticated admins can delete media files"
on storage.objects for delete
to authenticated
using (bucket_id = 'media');

insert into public.media_items (id, title, description, kind, source, url, thumbnail_url, sort_order, published) values
('00000000-0000-4000-8000-000000000001', 'NXT Academy Inauguration Ceremony', 'Inauguration ceremony and free-course feature by VLTV.', 'video', 'youtube', 'https://www.youtube.com/watch?v=94cTNGkPh64', 'https://i.ytimg.com/vi/94cTNGkPh64/hqdefault.jpg', 1, true),
('00000000-0000-4000-8000-000000000002', 'NXT Academy Free Course', 'A free-course feature with Askan Sheikh by VLTV.', 'video', 'youtube', 'https://www.youtube.com/watch?v=UZWM76dTrRk', 'https://i.ytimg.com/vi/UZWM76dTrRk/hqdefault.jpg', 2, true),
('00000000-0000-4000-8000-000000000003', 'NXT Academy Hospitality Free Course', 'A VLTV feature about NXT Academy''s free hospitality course.', 'video', 'youtube', 'https://www.youtube.com/watch?v=p84jNb_hvQ0', 'https://i.ytimg.com/vi/p84jNb_hvQ0/hqdefault.jpg', 3, true)
on conflict (id) do update set
title = excluded.title,
description = excluded.description,
kind = excluded.kind,
source = excluded.source,
url = excluded.url,
thumbnail_url = excluded.thumbnail_url,
sort_order = excluded.sort_order,
published = excluded.published;
