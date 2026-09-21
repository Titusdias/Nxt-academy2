'use client';

import { ArrowUpRight, Check, X } from 'lucide-react';
import { useEffect, useRef } from 'react';

const programs = {
  BBA: {
    title: 'BBA in Aviation & Hospitality Management',
    duration: '3 years',
    eligibility: 'Students who have completed 12th / PUC.',
    description: 'Build a strong foundation in business, aviation and hospitality management through a three-year degree program.',
    focus: ['Aviation and airport operations', 'Hospitality and service management', 'Business, communication and professional skills'],
  },
  DIPLOMA: {
    title: 'Diploma in Aviation & Hospitality Management',
    duration: '1 year',
    eligibility: 'Students who have completed 10th, 12th / PUC or a degree.',
    description: 'Develop practical aviation, hospitality and professional skills through a focused one-year diploma program.',
    focus: ['Passenger and guest service skills', 'Professional communication and grooming', 'Practical aviation and hospitality training'],
  },
} as const;

export default function ProgramDialog({ program, onClose }: { program: string | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const details = program ? programs[program as keyof typeof programs] : null;

  useEffect(() => {
    if (details) {
      ref.current?.showModal();
      document.body.style.overflow = 'hidden';
    } else {
      ref.current?.close();
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [details]);

  return <dialog ref={ref} className="program-dialog" aria-labelledby="program-title" onCancel={onClose} onClick={event => { if (event.target === ref.current) onClose(); }}>
    {details && <div>
      <button className="dialog-close" onClick={onClose} aria-label="Close program details"><X /></button>
      <div className="section-label">FIND YOUR DIRECTION / NXT ACADEMY</div>
      <h2 id="program-title">{details.title}</h2>
      <div className="dialog-program-meta"><strong>{details.duration}</strong><span>{details.eligibility}</span></div>
      <p>{details.description}</p>
      <h3>YOUR LEARNING FOCUS</h3>
      <ul>{details.focus.map(item => <li key={item}>{item}</li>)}</ul>
      <p className="dialog-placement"><Check size={17} />100% placement guaranteed</p>
      <p className="fineprint">Contact admissions for the curriculum, fees and next intake.</p>
      <a href="#contact" className="button button-light" onClick={onClose}>ENQUIRE ABOUT THIS PROGRAM <ArrowUpRight size={18} /></a>
    </div>}
  </dialog>;
}
