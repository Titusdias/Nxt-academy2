'use client';
import type { ImageLoaderProps } from 'next/image';
export default function imageLoader({src,width,quality}:ImageLoaderProps){const url=new URL(src);url.searchParams.set('w',String(width));url.searchParams.set('q',String(quality||80));url.searchParams.set('auto','format');return url.toString();}
