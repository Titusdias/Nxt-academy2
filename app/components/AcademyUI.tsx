'use client';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
export function Brand(){return <a className="brand" href="#home" aria-label="NXT Academy of Creative Studies home"><span className="brand-mark"><Image src="/nxt-academy-new-logo.jpeg" fill unoptimized sizes="72px" alt="NXT Academy logo" priority/></span><strong className="brand-name">NXT ACADEMY OF CREATIVE STUDIES</strong></a>}
export function Button({children,href='#contact',secondary=false}:{children:React.ReactNode;href?:string;secondary?:boolean}){return <a href={href} className={`button ${secondary?'secondary':''}`}>{children}<ArrowUpRight size={18}/></a>}
export function Label({children}:{children:React.ReactNode}){return <div className="section-label"><span/>{children}</div>}
