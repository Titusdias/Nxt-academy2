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
('00000000-0000-4000-8000-000000000003', 'NXT Academy of Creative Studies', 'Free course feature by VLTV.', 'video', 'youtube', 'https://www.youtube.com/watch?v=UZWM76dTrRk', 'https://i.ytimg.com/vi/UZWM76dTrRk/hqdefault.jpg', 1, true),
('00000000-0000-4000-8000-000000000005', 'A Place to Begin', 'NXT Academy campus in Bendur, Mangaluru.', 'image', 'local', '/academy-campus-exterior-2026.webp', '/academy-campus-exterior-2026.webp', 2, true),
('00000000-0000-4000-8000-000000000006', 'The NXT Campus', '', 'image', 'local', '/academy-campus-hero-new.jpeg', '/academy-campus-hero-new.jpeg', 3, true),
('00000000-0000-4000-8000-000000000007', 'Our Learning Space', '', 'image', 'local', '/academy-campus.jpeg', '/academy-campus.jpeg', 4, true)
on conflict (id) do nothing;
