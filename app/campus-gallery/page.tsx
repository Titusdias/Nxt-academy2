'use client';

import Image from 'next/image';
import { ArrowLeft, ArrowRight, Images } from 'lucide-react';
import { useEffect, useState } from 'react';
import { defaultMediaItems, fetchPublishedMedia, MediaItem } from '../media';

const defaultPhotos = defaultMediaItems.filter(item => item.kind === 'image');

export default function CampusGalleryPage() {
  const [photos, setPhotos] = useState<MediaItem[]>(defaultPhotos);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    let active = true;
    fetchPublishedMedia().then(items => {
      if (!active) return;
      setPhotos(items.filter(item => item.kind === 'image'));
      setSelected(0);
    });
    return () => { active = false; };
  }, []);

  const current = photos[selected];

  return <main className="gallery-page">
    <header className="gallery-page-header">
      <a href="/#student-life"><ArrowLeft size={18} /> Back to NXT Academy</a>
      <span>NXT ACADEMY OF CREATIVE STUDIES</span>
    </header>

    <section className="gallery-page-intro">
      <span className="gallery-page-eyebrow"><Images size={18} /> OUR CAMPUS</span>
      <h1>A Place to <em>Begin.</em></h1>
      <p>Explore the spaces where students learn, practise and grow at NXT Academy in Mangaluru.</p>
    </section>

    {current ? <>
      <section className="gallery-feature" aria-live="polite">
        <div className="gallery-feature-image"><Image src={current.url} fill unoptimized sizes="(max-width: 800px) 94vw, 82vw" alt={current.title} priority /></div>
        <div className="gallery-feature-copy"><span>{String(selected + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}</span><h2>{current.title}</h2>{current.description && <p>{current.description}</p>}</div>
      </section>

      <section className="gallery-grid" aria-label="Campus photo collection">
        {photos.map((photo, index) => <button className={selected === index ? 'is-active' : ''} type="button" onClick={() => setSelected(index)} key={photo.id} aria-label={`View ${photo.title}`}>
          <span><Image src={photo.thumbnailUrl || photo.url} fill unoptimized sizes="(max-width: 650px) 45vw, 28vw" alt="" /></span>
          <strong>{photo.title}</strong><small>View photo <ArrowRight size={14} /></small>
        </button>)}
      </section>
    </> : <section className="gallery-page-empty"><Images size={34} /><h2>Campus photos are coming soon.</h2><p>The academy can add photos from the media admin panel.</p></section>}
  </main>;
}
