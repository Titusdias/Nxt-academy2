'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { getYouTubeEmbed, MediaItem } from '../media';

type MediaHubProps = {
  items: MediaItem[];
};

export default function MediaHub({ items }: MediaHubProps) {
  const [selectedId, setSelectedId] = useState(items[0]?.id || '');
  const railRef = useRef<HTMLDivElement>(null);
  const selected = items.find(item => item.id === selectedId) || items[0];

  useEffect(() => {
    if (items.length && !items.some(item => item.id === selectedId)) setSelectedId(items[0].id);
  }, [items, selectedId]);

  const moveRail = (direction: number) => {
    railRef.current?.scrollBy({ left: direction * Math.min(720, railRef.current.clientWidth * .82), behavior: 'smooth' });
  };

  if (!selected) return <div className="media-hub media-hub-empty">
    <Play size={28} />
    <h3>New videos are coming soon.</h3>
    <p>The academy can publish YouTube videos here from the admin panel.</p>
  </div>;

  return <div className="media-hub">
    <div className="media-feature">
      <div className="media-player">
        <iframe src={getYouTubeEmbed(selected.url)} title={selected.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
      </div>
      <div className="media-feature-copy">
        <span>NOW SHOWING</span>
        <h3>{selected.title}</h3>
        {selected.description && <p>{selected.description}</p>}
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
          <i><Play size={18} fill="currentColor" /></i>
        </span>
        <span className="media-tile-copy"><small>{String(index + 1).padStart(2, '0')} · VIDEO</small><strong>{item.title}</strong></span>
      </button>)}
    </div>
  </div>;
}
