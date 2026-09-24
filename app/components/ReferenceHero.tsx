'use client';

import Image from 'next/image';
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Brand } from './AcademyUI';

const links = [
  ['Courses', 'courses'],
  ['Why NXT', 'why-nxt'],
  ['Student Life', 'student-life'],
  ['Contact', 'contact'],
];

const heroCourses = [
  { title: 'BBA in Aviation and Hospitality Management', duration: '3 years', image: '/course-bba-aviation.png' },
  { title: 'Diploma in Aviation and Hospitality Management', duration: '1 year', image: '/course-diploma-aviation-hospitality-v3.png' },
  { title: 'Diploma in Hospital Administration', duration: '1 year', image: '/course-hospital-admin.png' },
];

const heroSlides = [
  { image: '/course-bba-promo.webp', alt: 'BBA in Aviation and Hospitality Management at NXT Academy', eyebrow: '', title: 'BBA in Aviation and Hospitality Management', poster: true, aspectRatio: '2 / 1' },
  { image: '/course-diploma-aviation-hospitality-promo.webp', alt: 'Diploma in Aviation and Hospitality Management at NXT Academy', eyebrow: '', title: 'Diploma in Aviation and Hospitality Management', poster: true, aspectRatio: '1672 / 941' },
  { image: '/course-hospital-administration-promo.webp', alt: 'Diploma in Hospital Administration at NXT Academy', eyebrow: '', title: 'Diploma in Hospital Administration', poster: true, aspectRatio: '1672 / 941' },
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
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setActiveSlide(current => (current + 1) % heroSlides.length), 3000);
    return () => window.clearInterval(timer);
  }, []);

  return <>
    <section id="home" className="campus-hero hero-slider" style={{ aspectRatio: heroSlides[activeSlide].aspectRatio }} aria-roledescription="carousel" aria-label="NXT Academy highlights">
      <div className="hero-slides">{heroSlides.map((slide, index) => <div className={`hero-slide${activeSlide === index ? ' is-active' : ''}${slide.poster ? ' is-poster' : ''}`} key={slide.image} aria-hidden={activeSlide !== index}>
        <Image className="campus-hero-image" src={slide.image} fill unoptimized preload sizes="100vw" alt={slide.alt} />
      </div>)}</div>
      <div className={`campus-hero-shade${heroSlides[activeSlide].poster ? ' is-clear' : ''}`} />
      {!heroSlides[activeSlide].poster && <div className="hero-slider-copy">
        <span>{heroSlides[activeSlide].eyebrow}</span>
        <h1>{heroSlides[activeSlide].title}</h1>
      </div>}
      <div className="hero-slider-dots" aria-label="Choose hero image">{heroSlides.map((slide, index) => <button type="button" className={activeSlide === index ? 'is-active' : ''} aria-label={`Show image ${index + 1}: ${slide.title}`} aria-current={activeSlide === index ? 'true' : undefined} onClick={() => setActiveSlide(index)} key={slide.image} />)}</div>
      {!heroSlides[activeSlide].poster && <a className="campus-tour-link" href="#student-life">Take a look inside NXT <ArrowRight size={17} /></a>}
    </section>
    <section className="hero-programs-section" aria-labelledby="programs-at-nxt-title">
      <div className="hero-program-intro">
        <span>PROGRAMS AT NXT</span>
        <strong id="programs-at-nxt-title">Choose the path that fits your future</strong>
        <ChevronDown size={20} aria-hidden="true" />
      </div>
      <div className="hero-course-circles" aria-label="Programs at NXT Academy">{heroCourses.map(course => <a href="#courses" key={course.title}>
        <span><Image src={course.image} fill unoptimized sizes="(max-width:700px) 78vw, 20vw" alt="" /></span>
        <strong>{course.title}</strong>
        <small>{course.duration}</small>
      </a>)}</div>
    </section>
  </>;
}
