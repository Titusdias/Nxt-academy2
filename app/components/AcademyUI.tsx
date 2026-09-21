'use client';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
export function Brand(){return <a className="brand" href="#home" aria-label="NXT Academy home"><Image src="/nxt-academy-logo-transparent.png" fill unoptimized sizes="200px" alt="NXT Academy of Creative Studies" priority/></a>}
export function Button({children,href='#contact',secondary=false}:{children:React.ReactNode;href?:string;secondary?:boolean}){return <a href={href} className={`button ${secondary?'secondary':''}`}>{children}<ArrowUpRight size={18}/></a>}
export function Label({children}:{children:React.ReactNode}){return <div className="section-label"><span/>{children}</div>}
