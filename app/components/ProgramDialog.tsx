'use client';
import { useEffect, useRef } from 'react';
import { ArrowUpRight, X } from 'lucide-react';

const programDetails: Record<string, { duration: string; description: string; focus: string[] }> = {
  'BBA in Aviation and Hospitality Management': {
    duration: '3 years',
    description: 'Build a broad foundation in aviation, hospitality, management, communication and professional service.',
    focus: ['Aviation and hospitality operations', 'Management and professional communication', 'Guest and passenger service skills'],
  },
  'Diploma in Aviation and Hospitality Management': {
    duration: '1 year',
    description: 'Develop practical aviation and hospitality skills for guest, passenger and service-focused roles.',
    focus: ['Guest and passenger relations', 'Professional presentation and communication', 'Practical aviation and hospitality learning'],
  },
  'Diploma in Hospital Administration': {
    duration: '1 year',
    description: 'Learn the foundations of hospital administration, patient service and healthcare office coordination.',
    focus: ['Hospital front-office administration', 'Patient service and communication', 'Healthcare records and coordination'],
  },
};

export default function ProgramDialog({program,onClose}:{program:string|null;onClose:()=>void}){
  const ref=useRef<HTMLDialogElement>(null);
  const details=program ? programDetails[program] : null;
  const whatsappHref=`https://wa.me/918217337597?text=${encodeURIComponent(`Hello NXT Academy, I would like to enquire about ${program ?? 'your courses'}.`)}`;
  useEffect(()=>{if(program){ref.current?.showModal();document.body.style.overflow='hidden'}else{ref.current?.close();document.body.style.overflow=''}return()=>{document.body.style.overflow=''}},[program]);
  return <dialog ref={ref} className="program-dialog" aria-labelledby="program-title" onCancel={onClose} onClick={e=>{if(e.target===ref.current)onClose()}}><div><button className="dialog-close" onClick={onClose} aria-label="Close program details"><X/></button><div className="section-label">FIND YOUR DIRECTION / NXT ACADEMY</div><h2 id="program-title">{program}</h2>{details&&<><p><strong>{details.duration}</strong> · {details.description}</p><h3>YOUR LEARNING FOCUS</h3><ul>{details.focus.map(s=><li key={s}>{s}</li>)}</ul></>}<p className="fineprint">Confirm eligibility, curriculum, fees and the next intake directly with admissions.</p><a href={whatsappHref} className="button button-light" target="_blank" rel="noopener noreferrer" onClick={onClose}>ENQUIRE ABOUT THIS PROGRAM<ArrowUpRight size={18}/></a></div></dialog>;
}
