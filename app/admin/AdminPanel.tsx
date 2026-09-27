'use client';

import { FormEvent, useEffect, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowUp, Image as ImageIcon, LogOut, Plus, Save, Trash2, Upload, Video } from 'lucide-react';
import { getYouTubeId, getYouTubeThumbnail, mapMediaRow, mediaBackendConfigured, MediaItem, supabaseAnonKey, supabaseUrl } from '../media';

type Session = { access_token: string; user: { email?: string } };

const apiHeaders = (token: string, extra: Record<string, string> = {}) => ({ apikey: supabaseAnonKey, Authorization: `Bearer ${token}`, ...extra });

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-|-$/g, '');
}

async function uploadFile(file: File, token: string) {
  const path = `${Date.now()}-${slugify(file.name)}`;
  const response = await fetch(`${supabaseUrl}/storage/v1/object/media/${path}`, {
    method: 'POST',
    headers: apiHeaders(token, { 'Content-Type': file.type || 'application/octet-stream', 'x-upsert': 'false' }),
    body: file,
  });
  if (!response.ok) throw new Error((await response.json()).message || 'Upload failed');
  return `${supabaseUrl}/storage/v1/object/public/media/${path}`;
}

export default function AdminPanel() {
  const [session, setSession] = useState<Session | null>(null);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const youtubeItems = items.filter(item => item.kind === 'video' && item.source === 'youtube');
  const campusItems = items.filter(item => item.kind === 'image');

  useEffect(() => {
    const saved = sessionStorage.getItem('nxt-admin-session');
    if (saved) setSession(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (session) loadItems(session.access_token);
  }, [session]);

  const loadItems = async (token: string) => {
    setBusy(true);
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/media_items?select=*&order=sort_order.asc`, { headers: apiHeaders(token) });
      if (!response.ok) throw new Error('Could not load media. Please sign in again.');
      setItems((await response.json()).map(mapMediaRow));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not load media.');
    } finally { setBusy(false); }
  };

  const signIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setStatus('');
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: { apikey: supabaseAnonKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.get('email'), password: data.get('password') }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error_description || payload.msg || 'Sign in failed.');
      const nextSession = payload as Session;
      sessionStorage.setItem('nxt-admin-session', JSON.stringify(nextSession));
      setSession(nextSession);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Sign in failed.');
    } finally { setBusy(false); }
  };

  const signOut = () => {
    sessionStorage.removeItem('nxt-admin-session');
    setSession(null);
    setItems([]);
  };

  const nextSortOrder = () => items.length ? Math.max(...items.map(item => item.sortOrder)) + 1 : 1;

  const createItem = async (body: Record<string, unknown>, form: HTMLFormElement, message: string) => {
    if (!session) return;
    const response = await fetch(`${supabaseUrl}/rest/v1/media_items`, {
      method: 'POST',
      headers: apiHeaders(session.access_token, { 'Content-Type': 'application/json', Prefer: 'return=representation' }),
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error((await response.text()) || 'Could not save media.');
    form.reset();
    setStatus(message);
    await loadItems(session.access_token);
  };

  const addYouTubeVideo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session) return;
    setBusy(true);
    setStatus('');
    const form = event.currentTarget;
    const data = new FormData(form);
    const url = String(data.get('youtubeUrl') || '').trim();
    try {
      if (!getYouTubeId(url)) throw new Error('Paste a valid YouTube video link.');
      await createItem({
        title: String(data.get('title')).trim(), description: String(data.get('description') || '').trim(),
        kind: 'video', source: 'youtube', url, thumbnail_url: getYouTubeThumbnail(url),
        sort_order: nextSortOrder(), published: true,
      }, form, 'YouTube video added to the website.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not add the YouTube video.');
    } finally { setBusy(false); }
  };

  const addCampusPhoto = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session) return;
    setBusy(true);
    setStatus('');
    const form = event.currentTarget;
    const data = new FormData(form);
    const photo = data.get('photo');
    try {
      if (!(photo instanceof File) || !photo.size) throw new Error('Choose a campus photo to upload.');
      if (!photo.type.startsWith('image/')) throw new Error('Campus gallery accepts image files only.');
      if (photo.size > 10 * 1024 * 1024) throw new Error('Please choose an image smaller than 10 MB.');
      const url = await uploadFile(photo, session.access_token);
      await createItem({
        title: String(data.get('title')).trim(), description: String(data.get('description') || '').trim(),
        kind: 'image', source: 'upload', url, thumbnail_url: url,
        sort_order: nextSortOrder(), published: true,
      }, form, 'Campus photo added to the gallery.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not add the campus photo.');
    } finally { setBusy(false); }
  };

  const updateItem = async (id: string, changes: Record<string, unknown>) => {
    if (!session) return;
    setBusy(true);
    setStatus('');
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/media_items?id=eq.${id}`, {
        method: 'PATCH', headers: apiHeaders(session.access_token, { 'Content-Type': 'application/json' }), body: JSON.stringify(changes),
      });
      if (!response.ok) throw new Error('Could not update media.');
      await loadItems(session.access_token);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not update media.');
    } finally { setBusy(false); }
  };

  const removeItem = async (item: MediaItem) => {
    if (!session || !window.confirm(`Delete “${item.title}”?`)) return;
    setBusy(true);
    setStatus('');
    try {
      if (item.source === 'upload') {
        const publicPrefix = `${supabaseUrl}/storage/v1/object/public/media/`;
        const uploadedUrls = [item.url, item.thumbnailUrl].filter((value, index, all): value is string => Boolean(value) && value.startsWith(publicPrefix) && all.indexOf(value) === index);
        await Promise.all(uploadedUrls.map(value => fetch(`${supabaseUrl}/storage/v1/object/media/${value.slice(publicPrefix.length)}`, { method: 'DELETE', headers: apiHeaders(session.access_token) })));
      }
      const response = await fetch(`${supabaseUrl}/rest/v1/media_items?id=eq.${item.id}`, { method: 'DELETE', headers: apiHeaders(session.access_token) });
      if (!response.ok) throw new Error('Could not delete media.');
      setStatus('Media deleted.');
      await loadItems(session.access_token);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not delete media.');
    } finally { setBusy(false); }
  };

  const moveItem = async (collection: MediaItem[], index: number, direction: number) => {
    if (!session) return;
    const otherIndex = index + direction;
    if (otherIndex < 0 || otherIndex >= collection.length) return;
    setBusy(true);
    setStatus('');
    try {
      const current = collection[index];
      const other = collection[otherIndex];
      const responses = await Promise.all([
        fetch(`${supabaseUrl}/rest/v1/media_items?id=eq.${current.id}`, { method: 'PATCH', headers: apiHeaders(session.access_token, { 'Content-Type': 'application/json' }), body: JSON.stringify({ sort_order: other.sortOrder }) }),
        fetch(`${supabaseUrl}/rest/v1/media_items?id=eq.${other.id}`, { method: 'PATCH', headers: apiHeaders(session.access_token, { 'Content-Type': 'application/json' }), body: JSON.stringify({ sort_order: current.sortOrder }) }),
      ]);
      if (responses.some(response => !response.ok)) throw new Error('Could not change the order.');
      await loadItems(session.access_token);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not change the order.');
    } finally { setBusy(false); }
  };

  const renderItems = (collection: MediaItem[], emptyMessage: string) => <div className="admin-items">
    {!collection.length && !busy && <p className="admin-empty">{emptyMessage}</p>}
    {collection.map((item, index) => <article key={item.id}>
      <img src={item.thumbnailUrl || item.url} alt="" />
      <div><small>{item.kind === 'image' ? 'CAMPUS PHOTO' : 'YOUTUBE VIDEO'}</small><h3>{item.title}</h3><button className={`admin-publish${item.published ? ' is-on' : ''}`} type="button" onClick={() => updateItem(item.id, { published: !item.published })}>{item.published ? 'Published' : 'Hidden'}</button></div>
      <div className="admin-item-actions"><button type="button" aria-label={`Move ${item.title} up`} disabled={index === 0 || busy} onClick={() => moveItem(collection, index, -1)}><ArrowUp /></button><button type="button" aria-label={`Move ${item.title} down`} disabled={index === collection.length - 1 || busy} onClick={() => moveItem(collection, index, 1)}><ArrowDown /></button><button className="is-danger" type="button" aria-label={`Delete ${item.title}`} disabled={busy} onClick={() => removeItem(item)}><Trash2 /></button></div>
    </article>)}
  </div>;

  if (!mediaBackendConfigured) return <main className="admin-shell admin-setup">
    <a className="admin-back" href="/"><ArrowLeft size={18} /> Back to Website</a>
    <div className="admin-setup-card"><span>ADMIN SETUP</span><h1>Connect the Media Library</h1><p>The admin interface is ready. Add the Supabase project URL and anonymous key to Vercel, then redeploy to enable secure sign-in, YouTube links and campus photo uploads.</p><code>NEXT_PUBLIC_SUPABASE_URL</code><code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code><p className="admin-note">Use the included <strong>supabase/setup.sql</strong> file once in the Supabase SQL editor.</p></div>
  </main>;

  if (!session) return <main className="admin-shell admin-login">
    <a className="admin-back" href="/"><ArrowLeft size={18} /> Back to Website</a>
    <form onSubmit={signIn} className="admin-login-card"><span>NXT ACADEMY</span><h1>Media Admin</h1><p>Sign in to publish YouTube videos and manage the campus photo gallery.</p><label>Email<input type="email" name="email" required autoComplete="username" /></label><label>Password<input type="password" name="password" required autoComplete="current-password" /></label><button disabled={busy} type="submit">{busy ? 'Signing in…' : 'Sign In'}</button>{status && <p className="admin-status">{status}</p>}</form>
  </main>;

  return <main className="admin-shell">
    <header className="admin-header"><div><span>NXT ACADEMY</span><h1>Media Library</h1><p>Signed in as {session.user?.email}</p></div><div><a href="/" target="_blank" rel="noopener noreferrer">View Website</a><button type="button" onClick={signOut}><LogOut size={17} /> Sign Out</button></div></header>
    {status && <p className="admin-status admin-global-status">{status}</p>}

    <section className="admin-collection">
      <div className="admin-collection-heading"><span>01</span><div><h2>YouTube Videos</h2><p>These videos appear in “Choose What to Watch”. Paste a YouTube link and the thumbnail is created automatically.</p></div></div>
      <div className="admin-grid">
        <form onSubmit={addYouTubeVideo} className="admin-form">
          <div className="admin-section-title"><Plus size={20} /><div><h2>Add YouTube Video</h2><p>Only public YouTube video links are accepted.</p></div></div>
          <label>Video title<input name="title" required placeholder="Video title" /></label>
          <label>Short description<textarea name="description" rows={3} placeholder="Optional description" /></label>
          <label>YouTube link<input name="youtubeUrl" type="url" required placeholder="https://www.youtube.com/watch?v=..." /></label>
          <button className="admin-primary" disabled={busy} type="submit"><Save size={18} /> {busy ? 'Saving…' : 'Publish Video'}</button>
        </form>
        <section className="admin-library">
          <div className="admin-section-title"><Video size={20} /><div><h2>Video Playlist</h2><p>Change the order, visibility, or remove a video.</p></div></div>
          {busy && !items.length && <p>Loading media…</p>}
          {renderItems(youtubeItems, 'No YouTube videos have been added yet.')}
        </section>
      </div>
    </section>

    <section className="admin-collection admin-collection-gallery">
      <div className="admin-collection-heading"><span>02</span><div><h2>Campus Gallery</h2><p>These photos open when visitors click “Your Campus”. This area accepts image uploads only.</p></div></div>
      <div className="admin-grid">
        <form onSubmit={addCampusPhoto} className="admin-form">
          <div className="admin-section-title"><ImageIcon size={20} /><div><h2>Add Campus Photo</h2><p>Upload a JPG, PNG, WebP, GIF or other image file up to 10 MB.</p></div></div>
          <label>Photo title<input name="title" required placeholder="e.g. Training kitchen" /></label>
          <label>Short description<textarea name="description" rows={3} placeholder="Optional description" /></label>
          <label className="admin-file"><Upload size={18} /> Choose campus photo<input name="photo" type="file" accept="image/*" required /></label>
          <button className="admin-primary" disabled={busy} type="submit"><Save size={18} /> {busy ? 'Uploading…' : 'Add to Gallery'}</button>
        </form>
        <section className="admin-library">
          <div className="admin-section-title"><ImageIcon size={20} /><div><h2>Gallery Photos</h2><p>Reorder, hide, or delete photos from the campus gallery.</p></div></div>
          {renderItems(campusItems, 'No campus photos have been added yet.')}
        </section>
      </div>
    </section>
  </main>;
}
