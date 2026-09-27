-- Run this once in Supabase SQL Editor for an existing NXT Academy setup.
-- The website already filters these records, and this also hides old non-YouTube
-- videos at the data layer.

update public.media_items
set published = false,
    updated_at = now()
where kind = 'video'
  and source <> 'youtube';

insert into public.media_items (id, title, description, kind, source, url, thumbnail_url, sort_order, published) values
('00000000-0000-4000-8000-000000000008', 'NXT Academy Free Course — Kannada', 'NXT Academy of Creative Studies free course feature in Kannada by VLTV.', 'video', 'youtube', 'https://www.youtube.com/watch?v=p84jNb_hvQ0', 'https://i.ytimg.com/vi/p84jNb_hvQ0/hqdefault.jpg', 2, true)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  kind = excluded.kind,
  source = excluded.source,
  url = excluded.url,
  thumbnail_url = excluded.thumbnail_url,
  sort_order = excluded.sort_order,
  published = true,
  updated_at = now();
