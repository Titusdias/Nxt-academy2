'use client';

import Image from 'next/image';
import { ArrowRight, ArrowUpRight, GraduationCap, Menu, X } from 'lucide-react';
import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import { Brand } from './AcademyUI';

const links = [
  ['About NXT', 'about'],
  ['Courses', 'courses'],
  ['Why NXT', 'why-nxt'],
  ['Student Life', 'student-life'],
  ['Admissions', 'admissions'],
  ['FAQs', 'faq'],
  ['Contact', 'contact'],
];

const campusLinks = [
  { title: 'Our Story', href: 'about', image: '/academy-learning.webp', alt: 'Students learning together at NXT Academy' },
  { title: 'Student Life', href: 'student-life', image: '/nxt-classroom-hero.webp', alt: 'Students in an NXT Academy classroom' },
  { title: 'Aviation', href: 'courses', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=85', alt: 'View from an aircraft wing above the clouds' },
  { title: 'Hospitality', href: 'courses', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=85', alt: 'Professional hospitality setting' },
  { title: 'Admissions', href: 'admissions', image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=85', alt: 'Students collaborating in a learning space' },
];

export function AcademyHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);

  return <header className="reference-header campus-header">
    <Brand />
    <nav id="academy-navigation" aria-label="Main navigation" className={open ? 'open' : ''}>
      {links.map(([label, id]) => <a href={`#${id}`} key={id} onClick={() => setOpen(false)}>{label}</a>)}
    </nav>
    <a className="campus-header-enquire" href="#contact">Enquire now <ArrowRight size={17} /></a>
    <button className="menu-toggle" aria-controls="academy-navigation" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} onClick={() => setOpen(!open)}>
      {open ? <X /> : <Menu />}
    </button>
  </header>;
}

export default function ReferenceHero() {
  const completeHeadline = 'Learn with purpose.|Grow with confidence.';
  const [typedHeadline, setTypedHeadline] = useState('');

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) {
      setTypedHeadline(completeHeadline);
      return;
    }

    let index = 0;
    let typingTimer = 0;
    const startTimer = window.setTimeout(() => {
      typingTimer = window.setInterval(() => {
        index += 1;
        setTypedHeadline(completeHeadline.slice(0, index));
        if (index === completeHeadline.length) window.clearInterval(typingTimer);
      }, 54);
    }, 380);

    return () => {
      window.clearTimeout(startTimer);
      window.clearInterval(typingTimer);
    };
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const targets = Array.from(document.querySelectorAll<HTMLElement>(
      '.academy-intro,.compact-courses,.career-directions,.academy-sidebar>section,.admissions-note,.useful-links,.vision,.reference-advantages,.learning-highlights,.reference-faq,.reference-gallery,.contact,.compact-course,.advantage-grid button,.highlight-grid article,.media-grid a'
    ));
    document.documentElement.classList.add('motion-ready');
    targets.forEach((target, index) => {
      target.classList.add('scroll-reveal');
      target.style.setProperty('--reveal-delay', `${(index % 3) * 70}ms`);
    });

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -7% 0px' });
    targets.forEach(target => observer.observe(target));

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove('motion-ready');
    };
  }, []);

  const [typedFirst = '', typedSecond = ''] = typedHeadline.split('|');
  const typingSecondLine = typedHeadline.includes('|');
  const finishedTyping = typedHeadline === completeHeadline;

  return <><section id="home" className="photo-hero">
    <Image
      className="photo-hero-image"
      src="/academy-campus.jpeg"
      fill
      unoptimized
      preload
      sizes="100vw"
      alt="NXT Academy of Creative Studies campus in Mangaluru"
    />
    <div className="photo-hero-overlay" />
    <div className="photo-hero-content">
      <p className="photo-hero-kicker">NXT ACADEMY · MANGALURU</p>
      <h1 aria-label="Learn with purpose. Grow with confidence.">
        <span className="hero-type-row hero-type-first" aria-hidden="true"><span className="hero-type-reserve">Learn with purpose.</span><span className="hero-type-text">{typedFirst}{!typingSecondLine && <i className="hero-typing-cursor" />}</span></span>
        <span className="hero-type-row hero-type-second" aria-hidden="true"><span className="hero-type-reserve">Grow with confidence.</span><span className="hero-type-text">{typedSecond}{typingSecondLine && <i className={`hero-typing-cursor${finishedTyping ? ' finished' : ''}`} />}</span></span>
      </h1>
      <p className="photo-hero-description">Career-focused Hospitality and Aviation training for students after SSLC and PUC.</p>
      <div className="photo-hero-actions">
        <a className="photo-primary-action" href="#courses">Explore courses <ArrowRight size={18} /></a>
        <a className="photo-secondary-action" href="#contact">Talk to admissions</a>
      </div>
      <div className="photo-hero-proof">
        <GraduationCap size={18} />
        <span>Practical learning</span>
        <i />
        <span>Professional development</span>
      </div>
    </div>
    <a className="photo-hero-tour" href="#about">Take a look inside NXT <ArrowRight size={16} /></a>
  </section>
  <section className="campus-link-section" aria-labelledby="campus-link-heading">
    <div className="campus-link-grid">
      {campusLinks.map((item, index) => <a className="campus-circle-link" href={`#${item.href}`} key={item.title} style={{ '--circle-order': index } as CSSProperties}>
        <span className="campus-circle-photo">
          <Image src={item.image} fill unoptimized sizes="(max-width:760px) 72vw, 18vw" alt={item.alt} />
        </span>
        <span className="campus-circle-title">{item.title} <ArrowUpRight size={15} /></span>
      </a>)}
    </div>
    <h2 id="campus-link-heading">Skills for today. Careers for tomorrow.</h2>
  </section></>;
}
