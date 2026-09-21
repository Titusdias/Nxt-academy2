'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function AcademyMotion(){
 useEffect(()=>{
  gsap.registerPlugin(ScrollTrigger);
  const media=gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)',()=>{
   const ctx=gsap.context(()=>{
    document.querySelectorAll('.section').forEach(section=>{
     const heading=section.querySelector('h2');
     if(heading)gsap.from(heading,{y:24,opacity:0,duration:.8,ease:'power3.out',scrollTrigger:{trigger:heading,start:'top 93%',once:true}});
    });
    const revealGroups=['.reference-benefits>div','.course-card','.strength,.journey-step,.parent-list>div,.activity-grid>div','.life-section .swiper-slide','.testimonial-grid article','.faq-item'];
    revealGroups.forEach(selector=>document.querySelectorAll(selector).forEach((el,i)=>gsap.from(el,{y:28,opacity:0,duration:.7,delay:(i%3)*.08,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 93%',once:true}})));
    gsap.from('.journey-line',{scaleX:0,transformOrigin:'left',ease:'none',scrollTrigger:{trigger:'.journey-track',start:'top 85%',end:'bottom 55%',scrub:true}});
    gsap.from('.about-image',{clipPath:'inset(0 0 100% 0)',duration:1,ease:'power3.inOut',scrollTrigger:{trigger:'.about-image',start:'top 90%',once:true}});
    gsap.from('.final-cta',{y:35,opacity:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:'.final-cta',start:'top 88%',once:true}});
    gsap.to('.hero-photo',{y:30,ease:'none',scrollTrigger:{trigger:'.academy-hero',start:'top top',end:'bottom top',scrub:true}});
    gsap.to('.reference-backdrop img',{scale:1.08,ease:'none',scrollTrigger:{trigger:'.reference-hero',start:'top top',end:'bottom top',scrub:true}});
   });
   return()=>ctx.revert();
  });
  media.add('(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)',()=>{
   const cleanups:Array<()=>void>=[];
   document.querySelectorAll<HTMLElement>('.button,.course-card,.swiper-slide figure').forEach(el=>{
    const x=gsap.quickTo(el,'x',{duration:.4,ease:'power3.out'});
    const y=gsap.quickTo(el,'y',{duration:.4,ease:'power3.out'});
    const move=(e:PointerEvent)=>{const r=el.getBoundingClientRect();x((e.clientX-r.left-r.width/2)*.025);y((e.clientY-r.top-r.height/2)*.04)};
    const leave=()=>{x(0);y(0)};
    el.addEventListener('pointermove',move);el.addEventListener('pointerleave',leave);
    cleanups.push(()=>{el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',leave);gsap.killTweensOf(el);gsap.set(el,{clearProps:'transform'})});
   });
   return()=>cleanups.forEach(fn=>fn());
  });
  return()=>media.revert();
 },[]);
 return null;
}
