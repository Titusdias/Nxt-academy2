'use client';
import Image from 'next/image';
import { Menu, X, ArrowUpRight, GraduationCap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Brand } from './AcademyUI';
const links = [['About NXT','about'],['Courses','courses'],['Why NXT','why-nxt'],['Student Life','student-life'],['Admissions','admissions'],['FAQs','faq'],['Contact','contact']];
export function AcademyHeader(){
 const [open,setOpen]=useState(false);
 useEffect(()=>{const close=(event:KeyboardEvent)=>{if(event.key==='Escape')setOpen(false)};window.addEventListener('keydown',close);return()=>window.removeEventListener('keydown',close)},[]);
 return <header className="reference-header"><Brand/><nav id="academy-navigation" aria-label="Main navigation" className={open?'open':''}>{links.map(([label,id])=><a href={`#${id}`} key={id} onClick={()=>setOpen(false)}>{label}</a>)}</nav><button className="menu-toggle" aria-controls="academy-navigation" aria-label={open?'Close navigation':'Open navigation'} aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></header>
}
const circles=[
 {title:'Our Story',tag:'About NXT',description:'Discover our approach to learning and professional growth.',href:'about',image:'/academy-learning.webp'},
 {title:'Student Life',tag:'Learn together',description:'Build confidence through practice and shared experiences.',href:'student-life',image:'/nxt-classroom-hero.webp'},
 {title:'Aviation',tag:'Aim higher',description:'Explore aviation-focused skills and career preparation.',href:'courses',image:'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=85'},
 {title:'Hospitality',tag:'Service with heart',description:'Discover the art of service, communication and guest relations.',href:'courses',image:'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=85'},
 {title:'Admissions',tag:'Your next step',description:'Find your direction with our admissions team.',href:'admissions',image:'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=85'}
];
export default function ReferenceHero(){
 const headline='Hospitality & Aviation Academy';
 const [reducedMotion,setReducedMotion]=useState(false);
 const [typed,setTyped]=useState('');
 useEffect(()=>{
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  const update=()=>setReducedMotion(media.matches);
  update();
  media.addEventListener('change',update);
  return()=>media.removeEventListener('change',update);
 },[]);
 useEffect(()=>{
  if(reducedMotion){setTyped(headline);return}
  let timer:number|undefined;
  let index=0;
  const start=window.setTimeout(()=>{timer=window.setInterval(()=>{index+=1;setTyped(headline.slice(0,index));if(index===headline.length)window.clearInterval(timer)},58)},380);
  return()=>{window.clearTimeout(start);if(timer)window.clearInterval(timer)};
 },[reducedMotion]);
 return <section id="home" className="reference-hero"><div className="hero-heading"><p>Your future begins at NXT</p><h1 aria-label={headline}><span className="typewriter-reserve" aria-hidden="true">{headline}</span><span className="typewriter-text" aria-hidden="true">{typed}<span className={typed===headline?'typing-cursor finished':'typing-cursor'}/></span></h1></div><div className="hero-circles">{circles.map(c=><a className="circle-link" href={'#'+c.href} key={c.title}><div className="circle-photo"><Image src={c.image} fill unoptimized sizes="(max-width:600px) 42vw, 18vw" alt={c.title+' — illustrative photograph'} priority/><div className="circle-overlay"><small>{c.tag}</small><p>{c.description}</p><ArrowUpRight size={25}/></div></div><span className="circle-title">{c.title}<ArrowUpRight size={14}/></span></a>)}</div><div className="hero-welcome"><h2>Skills for today. Careers for tomorrow.</h2><p>Practical learning. Professional confidence. Your next chapter in Mangaluru.</p><a href="#contact" className="hero-enquire"><GraduationCap size={22}/> Talk to our admissions team <ArrowUpRight size={17}/></a></div></section>
}
