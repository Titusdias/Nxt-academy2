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
    id: 'campus-celebration',
    title: 'Celebrating Together',
    description: 'Campus moments at NXT Academy.',
    kind: 'video',
    source: 'local',
    url: '/media/nxt-campus-life-01.mp4',
    thumbnailUrl: '/media/nxt-campus-life-01-poster.jpg',
    sortOrder: 1,
    published: true,
  },
  {
    id: 'inside-nxt',
    title: 'A Look Around Campus',
    description: 'A closer look at life and learning inside NXT.',
    kind: 'video',
    source: 'local',
    url: '/media/nxt-campus-life-02.mp4',
    thumbnailUrl: '/media/nxt-campus-life-02-poster.jpg',
    sortOrder: 2,
    published: true,
  },
  {
    id: 'nxt-free-course',
    title: 'NXT Academy of Creative Studies',
    description: 'Free course feature by VLTV.',
    kind: 'video',
    source: 'youtube',
    url: 'https://www.youtube.com/watch?v=UZWM76dTrRk',
    thumbnailUrl: 'https://i.ytimg.com/vi/UZWM76dTrRk/hqdefault.jpg',
    sortOrder: 3,
    published: true,
  },
  {
    id: 'nxt-inauguration',
    title: 'NXT Academy Inauguration Ceremony',
    description: 'Inauguration ceremony coverage by VLTV.',
    kind: 'video',
    source: 'facebook',
    url: 'https://www.facebook.com/viewlive.tv/posts/nxt-academy-of-creative-studies-inauguration-ceremony-free-course-vltv-%E0%B2%A8%E0%B3%86%E0%B2%95%E0%B3%8D%E0%B2%B7%E0%B3%8D%E0%B2%9F%E0%B3%8D-/1670353431767873/',
    thumbnailUrl: '/academy-campus.jpeg',
    sortOrder: 4,
    published: true,
  },
  {
    id: 'campus-exterior-2026',
    title: 'A Place to Begin',
    description: 'NXT Academy campus in Bendur, Mangaluru.',
    kind: 'image',
    source: 'local',
    url: '/academy-campus-exterior-2026.webp',
    thumbnailUrl: '/academy-campus-exterior-2026.webp',
    sortOrder: 5,
    published: true,
  },
  {
    id: 'campus-front',
    title: 'The NXT Campus',
    kind: 'image',
    source: 'local',
    url: '/academy-campus-hero-new.jpeg',
    thumbnailUrl: '/academy-campus-hero-new.jpeg',
    sortOrder: 6,
    published: true,
  },
  {
    id: 'campus-building',
    title: 'Our Learning Space',
    kind: 'image',
    source: 'local',
    url: '/academy-campus.jpeg',
    thumbnailUrl: '/academy-campus.jpeg',
    sortOrder: 7,
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
    return rows.map(mapMediaRow);
  } catch {
    return defaultMediaItems;
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
