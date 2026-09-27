'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Images, Play } from 'lucide-react';
import { getFacebookEmbed, getYouTubeEmbed, MediaItem } from '../media';

type MediaHubProps = {
  items: MediaItem[];
  onOpenGallery: (mediaId: string) => void;
};

export default function MediaHub({ items, onOpenGallery }: MediaHubProps) {
  const [selectedId, setSelectedId] = useState(items[0]?.id || '');
  const railRef = useRef<HTMLDivElement>(null);
  const selected = items.find(item => item.id === selectedId) || items[0];

  useEffect(() => {
    if (items.length && !items.some(item => item.id === selectedId)) setSelectedId(items[0].id);
  }, [items, selectedId]);

  const moveRail = (direction: number) => {
    railRef.current?.scrollBy({ left: direction * Math.min(720, railRef.current.clientWidth * .82), behavior: 'smooth' });
  };

  if (!selected) return null;

  return <div className="media-hub">
    <div className="media-feature">
      <div className="media-player">
        {selected.kind === 'image' && <img src={selected.url} alt={selected.title} />}
        {selected.kind === 'video' && selected.source === 'youtube' && <iframe src={getYouTubeEmbed(selected.url)} title={selected.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />}
        {selected.kind === 'video' && selected.source === 'facebook' && <iframe src={getFacebookEmbed(selected.url)} title={selected.title} allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen />}
        {selected.kind === 'video' && !['youtube', 'facebook'].includes(selected.source) && <video key={selected.url} controls playsInline preload="metadata" poster={selected.thumbnailUrl} aria-label={selected.title}><source src={selected.url} /></video>}
      </div>
      <div className="media-feature-copy">
        <span>{selected.kind === 'video' ? 'NOW SHOWING' : 'PHOTO HIGHLIGHT'}</span>
        <h3>{selected.title}</h3>
        {selected.description && <p>{selected.description}</p>}
        {selected.kind === 'image' && <button type="button" onClick={() => onOpenGallery(selected.id)}><Images size={18} /> View Photo Gallery</button>}
      </div>
    </div>

    <div className="media-library-heading">
      <div><span>MEDIA LIBRARY</span><h3>Choose What to Watch</h3></div>
      <div className="media-rail-controls">
        <button type="button" aria-label="Scroll media left" onClick={() => moveRail(-1)}><ChevronLeft /></button>
        <button type="button" aria-label="Scroll media right" onClick={() => moveRail(1)}><ChevronRight /></button>
      </div>
    </div>
    <div className="media-rail" ref={railRef}>
      {items.map((item, index) => <button type="button" className={`media-tile${item.id === selected.id ? ' is-active' : ''}`} aria-pressed={item.id === selected.id} onClick={() => setSelectedId(item.id)} key={item.id}>
        <span className="media-tile-visual">
          <img src={item.thumbnailUrl || item.url} alt="" />
          {item.kind === 'video' && <i><Play size={18} fill="currentColor" /></i>}
        </span>
        <span className="media-tile-copy"><small>{String(index + 1).padStart(2, '0')} · {item.kind}</small><strong>{item.title}</strong></span>
      </button>)}
    </div>
  </div>;
}
