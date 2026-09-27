-- Run this once in Supabase SQL Editor for an existing NXT Academy setup.
-- The website already filters these records, and this also hides old non-YouTube
-- videos at the data layer.

update public.media_items
set published = false,
    updated_at = now()
where kind = 'video'
  and source <> 'youtube';
