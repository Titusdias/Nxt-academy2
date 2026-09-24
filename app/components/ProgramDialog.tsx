'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { ArrowUpRight, BookOpen, Clock3, IndianRupee, X } from 'lucide-react';

type ProgramDetails = {
  duration: string;
  totalFee: string;
  description: string;
  fees: { label: string; value: string }[];
  focus: string[];
  image: string;
};

const programDetails: Record<string, ProgramDetails> = {
  'BBA in Aviation and Hospitality Management': {
    duration: '3 years',
    totalFee: '₹3,30,000',
    description: 'A three-year program combining business management with aviation and hospitality operations. Students build an understanding of customer service, airport and hotel workflows, communication and workplace professionalism.',
    fees: [
      { label: '1st year', value: '₹1,30,000' },
      { label: '2nd year', value: '₹1,00,000' },
      { label: '3rd year', value: '₹1,00,000' },
    ],
    focus: ['Aviation and hospitality operations', 'Business management fundamentals', 'Guest and passenger service', 'Professional communication and presentation'],
    image: '/course-bba-promo.webp',
  },
  'Diploma in Aviation and Hospitality Management': {
    duration: '1 year',
    totalFee: '₹1,30,000',
    description: 'A focused one-year diploma that introduces practical service skills for aviation and hospitality environments. The program supports students in developing passenger service, guest relations, communication and professional presentation skills.',
    fees: [{ label: 'Program fee', value: '₹1,30,000' }],
    focus: ['Guest and passenger relations', 'Airport and hospitality service basics', 'Professional presentation and communication', 'Practical industry-focused learning'],
    image: '/course-diploma-aviation-hospitality-promo.webp',
  },
  'Diploma in Hospital Administration': {
    duration: '1 year',
    totalFee: '₹80,000',
    description: 'A one-year diploma introducing the day-to-day foundations of hospital administration. Students learn about patient coordination, front-office practices, healthcare records and professional communication in a service-focused environment.',
    fees: [{ label: 'Program fee', value: '₹80,000' }],
    focus: ['Hospital front-office administration', 'Patient service and coordination', 'Healthcare records and office practices', 'Professional communication'],
    image: '/course-hospital-administration-promo.webp',
  },
};

export default function ProgramDialog({ program, onClose }: { program: string | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const details = program ? programDetails[program] : null;
  const whatsappHref = `https://wa.me/918217337597?text=${encodeURIComponent(`Hello NXT Academy, I would like to enquire about ${program ?? 'your courses'}.`)}`;

  useEffect(() => {
    if (program) {
      ref.current?.showModal();
      ref.current?.scrollTo({ top: 0 });
      document.body.style.overflow = 'hidden';
    } else {
      ref.current?.close();
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [program]);

  useEffect(() => {
    const scroller = scrollRef.current;
    if (!program || !scroller) return;

    scroller.scrollTop = 0;
    let scrollTimer = 0;
    let stopTimer = 0;
    let startTimer = 0;

    const stopAutoScroll = () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(stopTimer);
      window.clearInterval(scrollTimer);
    };

    scroller.addEventListener('touchstart', stopAutoScroll, { passive: true });
    scroller.addEventListener('pointerdown', stopAutoScroll, { passive: true });
    scroller.addEventListener('wheel', stopAutoScroll, { passive: true });

    startTimer = window.setTimeout(() => {
      scrollTimer = window.setInterval(() => {
        const isInteracting = scroller.contains(document.activeElement);
        const maximumScroll = scroller.scrollHeight - scroller.clientHeight;
        if (!isInteracting && maximumScroll > 1 && scroller.scrollTop < maximumScroll - 1) {
          scroller.scrollTo({ top: Math.min(scroller.scrollTop + 2, maximumScroll), behavior: 'auto' });
        }
      }, 32);
      stopTimer = window.setTimeout(() => window.clearInterval(scrollTimer), 60000);
    }, 650);

    return () => {
      stopAutoScroll();
      scroller.removeEventListener('touchstart', stopAutoScroll);
      scroller.removeEventListener('pointerdown', stopAutoScroll);
      scroller.removeEventListener('wheel', stopAutoScroll);
    };
  }, [program]);

  return <dialog ref={ref} className="program-dialog" aria-labelledby="program-title" onCancel={onClose} onClick={event => { if (event.target === ref.current) onClose(); }}>
    <div className="program-dialog-shell">
      <button className="dialog-close" onClick={onClose} aria-label="Close program details"><X /></button>
      {details && <>
        <div className="program-dialog-scroll" ref={scrollRef}>
          <div className="program-dialog-image"><Image src={details.image} fill unoptimized sizes="(max-width:760px) 100vw, 760px" alt="" /></div>
          <div className="program-dialog-content">
          <div className="section-label">EXPLORE THE PROGRAM / NXT ACADEMY</div>
          <h2 id="program-title">{program}</h2>
          <p className="program-summary">{details.description}</p>

          <div className="program-facts">
            <div className="program-fact"><Clock3 size={22} /><span><small>Duration</small><strong>{details.duration}</strong></span></div>
            <div className="program-fact"><IndianRupee size={22} /><span><small>Total program fee</small><strong>{details.totalFee}</strong></span></div>
          </div>

          <section className="program-detail-section">
            <div className="program-section-heading"><span><IndianRupee size={18} /></span><div><small>YOUR INVESTMENT</small><h3>Fee structure</h3></div></div>
            <div className="program-fee-list">{details.fees.map(fee => <div className="program-fee-row" key={fee.label}><span>{fee.label}</span><strong>{fee.value}</strong></div>)}</div>
            <div className="program-fee-total"><span>Total program fee</span><strong>{details.totalFee}</strong></div>
          </section>

          <section className="program-detail-section">
            <div className="program-section-heading"><span><BookOpen size={18} /></span><div><small>WHAT YOU WILL EXPLORE</small><h3>Learning focus</h3></div></div>
            <ul className="program-focus-list">{details.focus.map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}</ul>
          </section>

            <p className="fineprint">Fees shown are based on the current information provided. Confirm eligibility, inclusions, payment schedule and the next intake directly with admissions.</p>
          </div>
        </div>
        <div className="program-dialog-action"><a href={whatsappHref} className="program-enquire" target="_blank" rel="noopener noreferrer" onClick={onClose}>ENQUIRE ABOUT THIS PROGRAM <ArrowUpRight size={18} /></a></div>
      </>}
    </div>
  </dialog>;
}
