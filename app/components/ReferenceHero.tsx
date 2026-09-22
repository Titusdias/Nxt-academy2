'use client';

import Image from 'next/image';
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Brand } from './AcademyUI';

const links = [
  ['Courses', 'courses'],
  ['Why NXT', 'why-nxt'],
  ['Student Life', 'student-life'],
  ['Admissions', 'admissions'],
  ['Contact', 'contact'],
];

const heroCourses = [
  { title: 'BBA in Aviation and Hospitality Management', duration: '3 years', image: '/course-bba-aviation.png' },
  { title: 'Diploma in Aviation and Hospitality Management', duration: '1 year', image: '/course-diploma-hospitality.png' },
  { title: 'Diploma in Hospital Administration', duration: '1 year', image: '/course-hospital-admin.png' },
];

const admissionsWhatsApp = 'https://wa.me/918217337597?text=Hello%20NXT%20Academy%2C%20I%20would%20like%20to%20enquire%20about%20admissions.';

export function AcademyHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false);
    const shadow = () => document.querySelector('.site-header')?.classList.toggle('is-scrolled', window.scrollY > 12);
    window.addEventListener('keydown', close);
    window.addEventListener('scroll', shadow, { passive: true });
    shadow();
    return () => {
      window.removeEventListener('keydown', close);
      window.removeEventListener('scroll', shadow);
    };
  }, []);

  return <header className="site-header">
    <Brand />
    <nav id="site-navigation" aria-label="Main navigation" className={open ? 'is-open' : ''}>
      {links.map(([label, id]) => <a href={`#${id}`} key={id} onClick={() => setOpen(false)}>{label}</a>)}
    </nav>
    <a className="header-enquire" href={admissionsWhatsApp} target="_blank" rel="noopener noreferrer">Enquire now <ArrowRight size={18} /></a>
    <button className="menu-toggle" aria-controls="site-navigation" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
  </header>;
}

export default function ReferenceHero() {
  return <section id="home" className="campus-hero">
    <Image className="campus-hero-image" src="/academy-campus-hero-new.jpeg" fill unoptimized preload sizes="100vw" alt="NXT Academy of Creative Studies campus in Mangaluru" />
    <div className="campus-hero-shade" />
    <div className="hero-program-intro">
      <span>PROGRAMS AT NXT</span>
      <strong>Choose the path that fits your future</strong>
      <ChevronDown size={20} aria-hidden="true" />
    </div>
    <div className="hero-course-circles" aria-label="Programs at NXT Academy">{heroCourses.map(course => <a href="#courses" key={course.title}>
      <span><Image src={course.image} fill unoptimized sizes="(max-width:700px) 28vw, 18vw" alt="" /></span>
      <strong>{course.title}</strong>
      <small>{course.duration}</small>
    </a>)}</div>
    <a className="campus-tour-link" href="#student-life">Take a look inside NXT <ArrowRight size={17} /></a>
  </section>;
}
