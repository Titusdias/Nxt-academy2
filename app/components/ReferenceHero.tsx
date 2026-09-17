'use client';
import Image from 'next/image';
import { ArrowRight, BookOpen, GraduationCap, Users, BriefcaseBusiness, Mouse, Menu, X } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Brand } from './AcademyUI';

const links = [['Home','home'],['About','about'],['Courses','courses'],['Why NXT','why-nxt'],['Student Life','student-life'],['Admissions','admissions'],['Contact','contact']];

export function AcademyHeader(){
 const [open,setOpen]=useState(false);
 useEffect(()=>{const close=(event:KeyboardEvent)=>{if(event.key==='Escape')setOpen(false)};window.addEventListener('keydown',close);return()=>window.removeEventListener('keydown',close)},[]);
 return <header className="reference-header"><Brand/><nav id="academy-navigation" aria-label="Main navigation" className={open?'open':''}>{links.map(([label,id])=><a href={`#${id}`} key={id} onClick={()=>setOpen(false)}>{label}</a>)}</nav><a className="nav-button" href="#contact">Enquire now<ArrowRight size={19}/></a><button className="menu-toggle" aria-controls="academy-navigation" aria-label={open?'Close navigation':'Open navigation'} aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></header>
}

export default function ReferenceHero(){
 const reduce=useReducedMotion();
 return <><section id="home" className="academy-hero reference-hero"><div className="reference-backdrop"><Image src="/nxt-classroom-hero.webp" alt="Illustrative scene of students learning in a professional classroom" fill unoptimized priority sizes="100vw" className="hero-photo"/></div><motion.div className="hero-copy" initial={reduce?false:{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:.8,ease:[.22,1,.36,1]}}><p className="hero-eyebrow">NXT ACADEMY OF CREATIVE STUDIES</p><h1>Skills for today.<br/>Careers for <span className="headline-accent">tomorrow.</span></h1><p className="hero-description">Career-focused training in Hospitality & Aviation<br className="desktop-break"/> for SSLC and PUC students.</p><div className="hero-actions"><a className="button" href="#courses">Explore courses<ArrowRight size={21}/></a><a className="button secondary" href="#student-life">Life at NXT<BookOpen size={19}/></a></div><p className="hero-signature">Learn. Practice. Grow.</p></motion.div><aside className="hero-aside"><p>MORE<br/>THAN AN<br/>ACADEMY</p><span className="aside-rule"/><a href="#student-life"><span className="student-life-icon"><GraduationCap size={24}/></span><span>Student life<br/>at NXT <ArrowRight size={16}/></span></a></aside><span className="hero-photo-credit">Illustrative learning imagery</span></section><section className="learning-strip reference-benefits" aria-label="Our learning approach">{[{icon:GraduationCap,title:'Practical learning',text:'Build skills through hands-on training.'},{icon:Users,title:'Professional development',text:'Grow your confidence and communication.'},{icon:BriefcaseBusiness,title:'Career-focused',text:'Training designed for your next step.'}].map(({icon:Icon,title,text})=><div key={title}><span className="benefit-icon"><Icon size={25} strokeWidth={1.8}/></span><span><strong>{title}</strong><small>{text}</small></span></div>)}<a href="#about" className="scroll-cue"><Mouse size={23}/><span>Scroll to explore</span></a></section></>
}
