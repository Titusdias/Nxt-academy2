'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** Progressive enhancement: content stays visible without JavaScript or motion. */
export default function SiteTransitions() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        document.querySelectorAll<HTMLElement>('.section').forEach(section => {
          const heading = section.querySelector('h2');
          const label = section.querySelector('.section-label');
          gsap.from([label, heading].filter(Boolean), {
            y: 36, autoAlpha: 0, duration: 1.05, stagger: .12, ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 88%', once: true },
          });
        });
        gsap.from('.course', {
          clipPath: 'inset(12% 0 0 0)', y: 45, opacity: 0,
          duration: 1.15, stagger: .16, ease: 'power3.out',
          scrollTrigger: { trigger: '.course-grid', start: 'top 87%', once: true },
        });
        gsap.from('.pathway-image', {
          clipPath: 'inset(0 0 100% 0)', duration: 1.25, ease: 'power3.inOut',
          scrollTrigger: { trigger: '.pathway-image', start: 'top 88%', once: true },
        });
        gsap.from('.contact form', {
          y: 35, opacity: 0, duration: .9, ease: 'power3.out',
          scrollTrigger: { trigger: '.contact form', start: 'top 90%', once: true },
        });
        gsap.fromTo('.hero-image', { y: 0 }, {
          y: 95, ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
        });
      });
      return () => ctx.revert();
    });
    media.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const cleanups: (() => void)[] = [];
      document.querySelectorAll<HTMLElement>('.button, .circle-link').forEach(button => {
        const x = gsap.quickTo(button, 'x', { duration: .45, ease: 'power3.out' });
        const y = gsap.quickTo(button, 'y', { duration: .45, ease: 'power3.out' });
        const move = (event: PointerEvent) => {
          const rect = button.getBoundingClientRect();
          x((event.clientX - rect.left - rect.width / 2) * .07);
          y((event.clientY - rect.top - rect.height / 2) * .13);
        };
        const leave = () => { x(0); y(0); };
        button.addEventListener('pointermove', move);
        button.addEventListener('pointerleave', leave);
        cleanups.push(() => {
          button.removeEventListener('pointermove', move);
          button.removeEventListener('pointerleave', leave);
          gsap.killTweensOf(button);
          gsap.set(button, { clearProps: 'transform' });
        });
      });
      const hero = document.querySelector<HTMLElement>('.hero');
      const moveLight = (event: PointerEvent) => {
        if (!hero) return;
        const bounds = hero.getBoundingClientRect();
        hero.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
        hero.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
      };
      hero?.addEventListener('pointermove', moveLight);
      return () => { cleanups.forEach(fn => fn()); hero?.removeEventListener('pointermove', moveLight); };
    });
    return () => media.revert();
  }, []);
  return null;
}
