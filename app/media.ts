export type MediaKind = 'video' | 'image';
export type MediaSource = 'local' | 'upload' | 'youtube' | 'facebook';

export type MediaItem = {
  id: string;
  title: string;
  description?: string;
  kind: MediaKind;
  source: MediaSource;
  url: string;
  thumbnailUrl?: string;
  sortOrder: number;
  published: boolean;
};

export const defaultMediaItems: MediaItem[] = [
  {
    id: 'nxt-inauguration-youtube',
    title: 'NXT Academy Inauguration Ceremony',
    description: 'Inauguration ceremony and free-course feature by VLTV.',
    kind: 'video',
    source: 'youtube',
    url: 'https://www.youtube.com/watch?v=94cTNGkPh64',
    thumbnailUrl: 'https://i.ytimg.com/vi/94cTNGkPh64/hqdefault.jpg',
    sortOrder: 1,
    published: true,
  },
  {
    id: 'nxt-free-course',
    title: 'NXT Academy Free Course',
    description: 'A free-course feature with Askan Sheikh by VLTV.',
    kind: 'video',
    source: 'youtube',
    url: 'https://www.youtube.com/watch?v=UZWM76dTrRk',
    thumbnailUrl: 'https://i.ytimg.com/vi/UZWM76dTrRk/hqdefault.jpg',
    sortOrder: 2,
    published: true,
  },
  {
    id: 'nxt-free-course-kannada',
    title: 'NXT Academy Hospitality Free Course',
    description: 'A VLTV feature about NXT Academy’s free hospitality course.',
    kind: 'video',
    source: 'youtube',
    url: 'https://www.youtube.com/watch?v=p84jNb_hvQ0',
    thumbnailUrl: 'https://i.ytimg.com/vi/p84jNb_hvQ0/hqdefault.jpg',
    sortOrder: 3,
    published: true,
  },
];

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '') || '';
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
export const mediaBackendConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export function getYouTubeId(value: string) {
  const match = value.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/);
  return match?.[1] || '';
}

export function getYouTubeEmbed(value: string) {
  const id = getYouTubeId(value);
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : value;
}

export function getYouTubeThumbnail(value: string) {
  const id = getYouTubeId(value);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : '';
}

export function getFacebookEmbed(value: string) {
  return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(value)}&show_text=false&width=1280`;
}

export async function fetchPublishedMedia(): Promise<MediaItem[]> {
  if (!mediaBackendConfigured) return defaultMediaItems;
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/media_items?select=*&published=eq.true&order=sort_order.asc`, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseAnonKey}` },
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Unable to load managed media');
    const rows = await response.json();
    const youtubeVideos = rows.map(mapMediaRow).filter(item => item.kind === 'video' && item.source === 'youtube');
    return youtubeVideos.length ? youtubeVideos : defaultMediaItems;
  } catch {
    return defaultMediaItems;
  }
}

export async function fetchPublishedGallery(): Promise<MediaItem[]> {
  if (!mediaBackendConfigured) return [];
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/media_items?select=*&published=eq.true&kind=eq.image&order=sort_order.asc`, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseAnonKey}` },
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Unable to load campus gallery');
    const rows = await response.json();
    return rows.map(mapMediaRow).filter(item => item.kind === 'image');
  } catch {
    return [];
  }
}

export function mapMediaRow(row: Record<string, unknown>): MediaItem {
  return {
    id: String(row.id),
    title: String(row.title || 'Untitled media'),
    description: row.description ? String(row.description) : '',
    kind: row.kind === 'image' ? 'image' : 'video',
    source: ['local', 'upload', 'youtube', 'facebook'].includes(String(row.source)) ? row.source as MediaSource : 'upload',
    url: String(row.url),
    thumbnailUrl: row.thumbnail_url ? String(row.thumbnail_url) : '',
    sortOrder: Number(row.sort_order || 0),
    published: row.published !== false,
  };
}
