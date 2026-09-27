'use client';

import { FormEvent, useEffect, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowUp, LogOut, Plus, Save, Trash2, Video } from 'lucide-react';
import { getYouTubeThumbnail, mapMediaRow, mediaBackendConfigured, MediaItem, supabaseAnonKey, supabaseUrl } from '../media';

type Session = { access_token: string; user: { email?: string } };

const apiHeaders = (token: string, extra: Record<string, string> = {}) => ({
  apikey: supabaseAnonKey,
  Authorization: `Bearer ${token}`,
  ...extra,
});

export default function AdminPanel() {
  const [session, setSession] = useState<Session | null>(null);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

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
      setItems((await response.json()).map(mapMediaRow).filter((item: MediaItem) => item.kind === 'video' && item.source === 'youtube'));
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

  const addMedia = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session) return;
    setBusy(true);
    setStatus('');
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const url = String(data.get('url') || '').trim();
      if (!getYouTubeThumbnail(url)) throw new Error('Add a valid YouTube video link.');

      const body = {
        title: String(data.get('title')).trim(),
        description: String(data.get('description') || '').trim(),
        kind: 'video',
        source: 'youtube',
        url,
        thumbnail_url: getYouTubeThumbnail(url),
        sort_order: items.length ? Math.max(...items.map(item => item.sortOrder)) + 1 : 1,
        published: true,
      };
      const response = await fetch(`${supabaseUrl}/rest/v1/media_items`, {
        method: 'POST',
        headers: apiHeaders(session.access_token, { 'Content-Type': 'application/json', Prefer: 'return=representation' }),
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error((await response.text()) || 'Could not save media.');
      form.reset();
      setStatus('Media added successfully.');
      await loadItems(session.access_token);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not add media.');
    } finally { setBusy(false); }
  };

  const updateItem = async (id: string, changes: Record<string, unknown>) => {
    if (!session) return;
    setBusy(true);
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/media_items?id=eq.${id}`, {
        method: 'PATCH',
        headers: apiHeaders(session.access_token, { 'Content-Type': 'application/json' }),
        body: JSON.stringify(changes),
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
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/media_items?id=eq.${item.id}`, { method: 'DELETE', headers: apiHeaders(session.access_token) });
      if (!response.ok) throw new Error('Could not delete media.');
      await loadItems(session.access_token);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not delete media.');
    } finally { setBusy(false); }
  };

  const moveItem = async (index: number, direction: number) => {
    if (!session) return;
    const otherIndex = index + direction;
    if (otherIndex < 0 || otherIndex >= items.length) return;
    const current = items[index];
    const other = items[otherIndex];
    await Promise.all([
      fetch(`${supabaseUrl}/rest/v1/media_items?id=eq.${current.id}`, { method: 'PATCH', headers: apiHeaders(session.access_token, { 'Content-Type': 'application/json' }), body: JSON.stringify({ sort_order: other.sortOrder }) }),
      fetch(`${supabaseUrl}/rest/v1/media_items?id=eq.${other.id}`, { method: 'PATCH', headers: apiHeaders(session.access_token, { 'Content-Type': 'application/json' }), body: JSON.stringify({ sort_order: current.sortOrder }) }),
    ]);
    await loadItems(session.access_token);
  };

  if (!mediaBackendConfigured) return <main className="admin-shell admin-setup">
    <a className="admin-back" href="/"><ArrowLeft size={18} /> Back to Website</a>
    <div className="admin-setup-card"><span>ADMIN SETUP</span><h1>Connect the Media Library</h1><p>The admin interface is ready. Add the Supabase project URL and anonymous key to Vercel, then redeploy to enable secure sign-in and YouTube video management.</p><code>NEXT_PUBLIC_SUPABASE_URL</code><code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code><p className="admin-note">Use the included <strong>supabase/setup.sql</strong> file once in the Supabase SQL editor.</p></div>
  </main>;

  if (!session) return <main className="admin-shell admin-login">
    <a className="admin-back" href="/"><ArrowLeft size={18} /> Back to Website</a>
    <form onSubmit={signIn} className="admin-login-card"><span>NXT ACADEMY</span><h1>Media Admin</h1><p>Sign in to add, arrange, publish or remove YouTube videos.</p><label>Email<input type="email" name="email" required autoComplete="username" /></label><label>Password<input type="password" name="password" required autoComplete="current-password" /></label><button disabled={busy} type="submit">{busy ? 'Signing in…' : 'Sign In'}</button>{status && <p className="admin-status">{status}</p>}</form>
  </main>;

  return <main className="admin-shell">
    <header className="admin-header"><div><span>NXT ACADEMY</span><h1>Media Library</h1><p>Signed in as {session.user?.email}</p></div><div><a href="/" target="_blank" rel="noopener noreferrer">View Website</a><button type="button" onClick={signOut}><LogOut size={17} /> Sign Out</button></div></header>
    <section className="admin-grid">
      <form onSubmit={addMedia} className="admin-form">
        <div className="admin-section-title"><Plus size={20} /><div><h2>Add YouTube Video</h2><p>Paste the public YouTube video link.</p></div></div>
        <label>Title<input name="title" required placeholder="Media title" /></label>
        <label>Description<textarea name="description" rows={3} placeholder="Short optional description" /></label>
        <label>YouTube link<input name="url" type="url" required placeholder="https://www.youtube.com/watch?v=..." /></label>
        <button className="admin-primary" disabled={busy} type="submit"><Save size={18} /> {busy ? 'Saving…' : 'Add to Website'}</button>
        {status && <p className="admin-status">{status}</p>}
      </form>

      <section className="admin-library">
        <div className="admin-section-title"><Video size={20} /><div><h2>Published Media</h2><p>Change the order, visibility, or remove an item.</p></div></div>
        {busy && !items.length && <p>Loading media…</p>}
        <div className="admin-items">{items.map((item, index) => <article key={item.id}>
          <img src={item.thumbnailUrl || item.url} alt="" />
          <div><small>{item.kind} · {item.source}</small><h3>{item.title}</h3><button className={`admin-publish${item.published ? ' is-on' : ''}`} type="button" onClick={() => updateItem(item.id, { published: !item.published })}>{item.published ? 'Published' : 'Hidden'}</button></div>
          <div className="admin-item-actions"><button type="button" aria-label={`Move ${item.title} up`} disabled={index === 0} onClick={() => moveItem(index, -1)}><ArrowUp /></button><button type="button" aria-label={`Move ${item.title} down`} disabled={index === items.length - 1} onClick={() => moveItem(index, 1)}><ArrowDown /></button><button className="is-danger" type="button" aria-label={`Delete ${item.title}`} onClick={() => removeItem(item)}><Trash2 /></button></div>
        </article>)}</div>
      </section>
    </section>
  </main>;
}
