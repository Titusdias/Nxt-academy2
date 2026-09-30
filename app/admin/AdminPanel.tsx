'use client';

import { FormEvent, useEffect, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowUp, Image as ImageIcon, LogOut, Plus, Save, Trash2, Upload, Video } from 'lucide-react';
import { getYouTubeThumbnail, mapMediaRow, mediaBackendConfigured, MediaItem, supabaseAnonKey, supabaseUrl } from '../media';

type Session = { access_token: string; user: { email?: string } };
const apiHeaders = (token: string, extra: Record<string, string> = {}) => ({ apikey: supabaseAnonKey, Authorization: `Bearer ${token}`, ...extra });
const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-|-$/g, '');

async function uploadGalleryPhoto(file: File, token: string) {
  if (!file.type.startsWith('image/')) throw new Error('Choose a JPG, PNG or WebP image.');
  if (file.size > 8 * 1024 * 1024) throw new Error('Photo must be smaller than 8 MB.');
  const path = `gallery/${Date.now()}-${slugify(file.name)}`;
  const response = await fetch(`${supabaseUrl}/storage/v1/object/media/${path}`, { method: 'POST', headers: apiHeaders(token, { 'Content-Type': file.type, 'x-upsert': 'false' }), body: file });
  if (!response.ok) throw new Error((await response.json()).message || 'Photo upload failed.');
  return `${supabaseUrl}/storage/v1/object/public/media/${path}`;
}

export default function AdminPanel() {
  const [session, setSession] = useState<Session | null>(null);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const youtubeItems = items.filter(item => item.kind === 'video' && item.source === 'youtube');
  const galleryItems = items.filter(item => item.kind === 'image');

  useEffect(() => { const saved = sessionStorage.getItem('nxt-admin-session'); if (saved) setSession(JSON.parse(saved)); }, []);
  useEffect(() => { if (session) loadItems(session.access_token); }, [session]);

  const loadItems = async (token: string) => {
    setBusy(true);
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/media_items?select=*&order=sort_order.asc`, { headers: apiHeaders(token) });
      if (!response.ok) throw new Error('Could not load media. Please sign in again.');
      setItems((await response.json()).map(mapMediaRow));
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Could not load media.'); }
    finally { setBusy(false); }
  };

  const signIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setBusy(true); setStatus('');
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, { method: 'POST', headers: { apikey: supabaseAnonKey, 'Content-Type': 'application/json' }, body: JSON.stringify({ email: data.get('email'), password: data.get('password') }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error_description || payload.msg || 'Sign in failed.');
      const nextSession = payload as Session; sessionStorage.setItem('nxt-admin-session', JSON.stringify(nextSession)); setSession(nextSession);
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Sign in failed.'); }
    finally { setBusy(false); }
  };

  const signOut = () => { sessionStorage.removeItem('nxt-admin-session'); setSession(null); setItems([]); };
  const nextSortOrder = () => items.length ? Math.max(...items.map(item => item.sortOrder)) + 1 : 1;

  const insertItem = async (body: Record<string, unknown>, successMessage: string) => {
    if (!session) return;
    const response = await fetch(`${supabaseUrl}/rest/v1/media_items`, { method: 'POST', headers: apiHeaders(session.access_token, { 'Content-Type': 'application/json', Prefer: 'return=representation' }), body: JSON.stringify(body) });
    if (!response.ok) throw new Error((await response.text()) || 'Could not save media.');
    setStatus(successMessage); await loadItems(session.access_token);
  };

  const addYouTubeVideo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); if (!session) return; setBusy(true); setStatus('');
    const form = event.currentTarget; const data = new FormData(form);
    try {
      const url = String(data.get('url') || '').trim(); const thumbnail = getYouTubeThumbnail(url);
      if (!thumbnail) throw new Error('Add a valid YouTube video link.');
      await insertItem({ title: String(data.get('title')).trim(), description: String(data.get('description') || '').trim(), kind: 'video', source: 'youtube', url, thumbnail_url: thumbnail, sort_order: nextSortOrder(), published: true }, 'YouTube video added successfully.'); form.reset();
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Could not add video.'); }
    finally { setBusy(false); }
  };

  const addGalleryPhoto = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); if (!session) return; setBusy(true); setStatus('');
    const form = event.currentTarget; const data = new FormData(form); let uploadedUrl = '';
    try {
      const file = data.get('photo'); if (!(file instanceof File) || !file.size) throw new Error('Choose a campus photo to upload.');
      uploadedUrl = await uploadGalleryPhoto(file, session.access_token);
      await insertItem({ title: String(data.get('title')).trim(), description: String(data.get('description') || '').trim(), kind: 'image', source: 'upload', url: uploadedUrl, thumbnail_url: uploadedUrl, sort_order: nextSortOrder(), published: true }, 'Campus photo added successfully.'); form.reset();
    } catch (error) {
      if (uploadedUrl) { const prefix = `${supabaseUrl}/storage/v1/object/public/media/`; await fetch(`${supabaseUrl}/storage/v1/object/media/${uploadedUrl.slice(prefix.length)}`, { method: 'DELETE', headers: apiHeaders(session.access_token) }); }
      setStatus(error instanceof Error ? error.message : 'Could not add photo.');
    } finally { setBusy(false); }
  };

  const updateItem = async (id: string, changes: Record<string, unknown>) => {
    if (!session) return; setBusy(true);
    try { const response = await fetch(`${supabaseUrl}/rest/v1/media_items?id=eq.${id}`, { method: 'PATCH', headers: apiHeaders(session.access_token, { 'Content-Type': 'application/json' }), body: JSON.stringify(changes) }); if (!response.ok) throw new Error('Could not update media.'); await loadItems(session.access_token); }
    catch (error) { setStatus(error instanceof Error ? error.message : 'Could not update media.'); }
    finally { setBusy(false); }
  };

  const removeItem = async (item: MediaItem) => {
    if (!session || !window.confirm(`Delete “${item.title}”?`)) return; setBusy(true);
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/media_items?id=eq.${item.id}`, { method: 'DELETE', headers: apiHeaders(session.access_token) }); if (!response.ok) throw new Error('Could not delete media.');
      if (item.source === 'upload') { const prefix = `${supabaseUrl}/storage/v1/object/public/media/`; if (item.url.startsWith(prefix)) await fetch(`${supabaseUrl}/storage/v1/object/media/${item.url.slice(prefix.length)}`, { method: 'DELETE', headers: apiHeaders(session.access_token) }); }
      await loadItems(session.access_token);
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Could not delete media.'); }
    finally { setBusy(false); }
  };

  const moveItem = async (list: MediaItem[], index: number, direction: number) => {
    if (!session) return; const otherIndex = index + direction; if (otherIndex < 0 || otherIndex >= list.length) return;
    const current = list[index]; const other = list[otherIndex]; setBusy(true);
    try { await Promise.all([fetch(`${supabaseUrl}/rest/v1/media_items?id=eq.${current.id}`, { method: 'PATCH', headers: apiHeaders(session.access_token, { 'Content-Type': 'application/json' }), body: JSON.stringify({ sort_order: other.sortOrder }) }), fetch(`${supabaseUrl}/rest/v1/media_items?id=eq.${other.id}`, { method: 'PATCH', headers: apiHeaders(session.access_token, { 'Content-Type': 'application/json' }), body: JSON.stringify({ sort_order: current.sortOrder }) })]); await loadItems(session.access_token); }
    finally { setBusy(false); }
  };

  const renderItems = (list: MediaItem[], emptyMessage: string) => <div className="admin-items">
    {!list.length && !busy && <p className="admin-empty">{emptyMessage}</p>}
    {list.map((item, index) => <article key={item.id}><img src={item.thumbnailUrl || item.url} alt="" /><div><small>{item.kind === 'image' ? 'Campus gallery' : 'YouTube video'}</small><h3>{item.title}</h3><button className={`admin-publish${item.published ? ' is-on' : ''}`} type="button" onClick={() => updateItem(item.id, { published: !item.published })}>{item.published ? 'Published' : 'Hidden'}</button></div><div className="admin-item-actions"><button type="button" aria-label={`Move ${item.title} up`} disabled={index === 0} onClick={() => moveItem(list, index, -1)}><ArrowUp /></button><button type="button" aria-label={`Move ${item.title} down`} disabled={index === list.length - 1} onClick={() => moveItem(list, index, 1)}><ArrowDown /></button><button className="is-danger" type="button" aria-label={`Delete ${item.title}`} onClick={() => removeItem(item)}><Trash2 /></button></div></article>)}
  </div>;

  if (!mediaBackendConfigured) return <main className="admin-shell admin-setup"><a className="admin-back" href="/"><ArrowLeft size={18} /> Back to Website</a><div className="admin-setup-card"><span>ADMIN SETUP</span><h1>Connect the Media Library</h1><p>Add the Supabase project URL and publishable key to Vercel, then redeploy to enable YouTube and campus gallery management.</p><code>NEXT_PUBLIC_SUPABASE_URL</code><code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code><p className="admin-note">Use the included <strong>supabase/setup.sql</strong> file once in the Supabase SQL editor.</p></div></main>;
  if (!session) return <main className="admin-shell admin-login"><a className="admin-back" href="/"><ArrowLeft size={18} /> Back to Website</a><form onSubmit={signIn} className="admin-login-card"><span>NXT ACADEMY</span><h1>Media Admin</h1><p>Sign in to manage YouTube videos and campus gallery photos.</p><label>Email<input type="email" name="email" required autoComplete="username" /></label><label>Password<input type="password" name="password" required autoComplete="current-password" /></label><button disabled={busy} type="submit">{busy ? 'Signing in…' : 'Sign In'}</button>{status && <p className="admin-status">{status}</p>}</form></main>;

  return <main className="admin-shell"><header className="admin-header"><div><span>NXT ACADEMY</span><h1>Media Library</h1><p>Signed in as {session.user?.email}</p></div><div><a href="/" target="_blank" rel="noopener noreferrer">View Website</a><button type="button" onClick={signOut}><LogOut size={17} /> Sign Out</button></div></header><section className="admin-grid">
    <div className="admin-form-stack"><form onSubmit={addYouTubeVideo} className="admin-form"><div className="admin-section-title"><Plus size={20} /><div><h2>Add YouTube Video</h2><p>Paste a public YouTube video link.</p></div></div><label>Title<input name="title" required placeholder="Video title" /></label><label>Description<textarea name="description" rows={3} placeholder="Short optional description" /></label><label>YouTube link<input name="url" type="url" required placeholder="https://www.youtube.com/watch?v=..." /></label><button className="admin-primary" disabled={busy} type="submit"><Save size={18} /> {busy ? 'Saving…' : 'Add YouTube Video'}</button></form>
      <form onSubmit={addGalleryPhoto} className="admin-form"><div className="admin-section-title"><ImageIcon size={20} /><div><h2>Add Campus Photo</h2><p>This photo will appear in the third Life at NXT card.</p></div></div><label>Photo title<input name="title" required placeholder="Example: Campus celebration" /></label><label>Description<textarea name="description" rows={2} placeholder="Optional description" /></label><label className="admin-file"><Upload size={18} /> Choose photo<input name="photo" type="file" accept="image/jpeg,image/png,image/webp" required /></label><button className="admin-primary" disabled={busy} type="submit"><Upload size={18} /> {busy ? 'Uploading…' : 'Add Campus Photo'}</button></form>{status && <p className="admin-status">{status}</p>}</div>
    <section className="admin-library"><div className="admin-library-group"><div className="admin-section-title"><Video size={20} /><div><h2>YouTube Videos</h2><p>Arrange, hide or remove videos.</p></div></div>{renderItems(youtubeItems, 'No YouTube videos added yet.')}</div><div className="admin-library-group"><div className="admin-section-title"><ImageIcon size={20} /><div><h2>Campus Gallery</h2><p>The first published photo appears on the third card.</p></div></div>{renderItems(galleryItems, 'No campus photos yet. The website shows a placeholder until one is uploaded.')}</div></section>
  </section></main>;
}
