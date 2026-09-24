'use client';

import Image from 'next/image';
import { FormEvent, useState } from 'react';
import {
  ArrowRight, ArrowUpRight, BookOpen, BriefcaseBusiness,
  ChevronDown, CircleCheck, Mail, MapPin,
  MessageCircle, Phone, PlaneTakeoff, Users,
} from 'lucide-react';
import ReferenceHero, { AcademyHeader } from './components/ReferenceHero';
import ProgramDialog from './components/ProgramDialog';
import { Brand } from './components/AcademyUI';

const advantages = [
  { title: 'Practical Learning', text: 'Learn through activity-based training and hands-on sessions.' },
  { title: 'Professional Development', text: 'Build communication, confidence and professional presentation.' },
  { title: 'Industry-Relevant Skills', text: 'Build a foundation in service and industry-focused skills.' },
  { title: 'Career-Focused Approach', text: 'Learn with a clear direction for your next professional step.' },
];

const advantageIcons = [BookOpen, Users, BriefcaseBusiness, CircleCheck];

const programs = [
  { title: 'BBA in Aviation and Hospitality Management', duration: '3 years', detail: 'Aviation · Hospitality · Management', image: '/course-bba-aviation.png' },
  { title: 'Diploma in Aviation and Hospitality Management', duration: '1 year', detail: 'Guest service · Aviation · Communication', image: '/course-diploma-aviation-hospitality-v3.png' },
  { title: 'Diploma in Hospital Administration', duration: '1 year', detail: 'Healthcare service · Administration', image: '/course-hospital-admin.png' },
];

const steps = [
  ['01', 'Discover'],
  ['02', 'Learn'],
  ['03', 'Practice'],
  ['04', 'Grow'],
  ['05', 'Prepare'],
];

const faqs = [
  ['Who can apply to NXT Academy?', 'Students who have completed 10th or 12th and are interested in aviation, hospitality or hospital administration can enquire. Admissions will confirm program-specific requirements.'],
  ['What courses are offered?', 'NXT Academy offers a 3-year BBA in Aviation and Hospitality Management, a 1-year Diploma in Aviation and Hospitality Management, and a 1-year Diploma in Hospital Administration.'],
  ['Does the training include practical sessions?', 'Yes. The learning experience includes presentations, communication practice, role play, group activities and practical demonstrations.'],
  ['How do I know which course suits me?', 'Speak with the admissions team about your interests, educational background and career direction. They can explain each program before you decide.'],
  ['Where is NXT Academy located?', 'NXT Academy of Creative Studies is in Mangaluru, Karnataka. Contact admissions for the exact campus address and directions.'],
  ['How can I enquire about admissions?', 'Call or WhatsApp +91 821 733 7597, email nxtacademy69@gmail.com, or use the enquiry form below.'],
];

export default function Home() {
  const [program, setProgram] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState(0);
  const [whatsappUrl, setWhatsappUrl] = useState('');

  function prepareEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const message = [
      'Hello NXT Academy, I would like to enquire about admissions.',
      `Name: ${data.get('name')}`,
      `Phone: ${data.get('phone')}`,
      `Email: ${data.get('email')}`,
      `Qualification: ${data.get('qualification')}`,
      `Interested course: ${data.get('course')}`,
    ].filter(Boolean).join('\n');
    setWhatsappUrl(`https://wa.me/918217337597?text=${encodeURIComponent(message)}`);
  }

  return <>
    <AcademyHeader />
    <main>
      <ReferenceHero />

      <section id="courses" className="direction-section compact-courses">
        <div className="compact-courses-heading">
          <p>COURSES AT NXT</p>
          <h2>Choose Your Direction</h2>
        </div>
        <div className="compact-course-grid">
          {programs.map(course => <button className="compact-course-card" key={course.title} onClick={() => setProgram(course.title)}>
            <span className="compact-course-image"><Image src={course.image} fill unoptimized sizes="(max-width:700px) 30vw, 20vw" alt="" /></span>
            <span className="compact-course-copy"><strong>{course.title}</strong><small>{course.duration} · {course.detail}</small></span>
            <span className="compact-course-arrow" aria-hidden="true"><ArrowRight size={20} /></span>
          </button>)}
        </div>
      </section>

      <section id="why-nxt" className="section why-redesign">
        <div className="why-heading"><span className="eyebrow">THE NXT ADVANTAGE</span><h2>Why Choose NXT Academy</h2><p>A learning experience built around the skills you need and the person you’re becoming.</p></div>
        <div className="why-graphic-list">{advantages.map(({ title, text }, index) => {
          const AdvantageIcon = advantageIcons[index];
          return <article className="why-graphic-item" key={title}>
            <span className="why-graphic-icon" aria-hidden="true"><AdvantageIcon size={31} strokeWidth={1.7} /></span>
            <span className="why-graphic-copy"><span className="advantage-index">0{index + 1}</span><h3>{title}</h3><p>{text}</p></span>
          </article>;
        })}</div>
      </section>

      <section className="section experience-redesign">
        <div className="experience-copy"><span className="eyebrow">THE LEARNING EXPERIENCE</span><h2>Less watching.<br /><em>More doing.</em></h2><p>Practical activities make it easier to understand, remember and confidently use what you learn.</p><div className="activity-list">{['Presentation practice', 'Communication sessions', 'Role play & group activities', 'Professional grooming', 'Practical demonstrations', 'Career guidance', 'Social activities', 'Industrial visits'].map(item => <span key={item}><CircleCheck size={18} />{item}</span>)}</div></div>
      </section>

      <section id="journey" className="section journey-roadmap">
        <div className="roadmap-heading"><span className="eyebrow">YOUR PROGRESS</span><h2>From student to <em>career-ready.</em></h2></div>
        <div className="roadmap-stage">
          <svg className="roadmap-road" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
            <path className="roadmap-shadow" d="M65 500 C180 570 330 525 300 405 C270 290 430 250 520 340 C610 430 760 350 720 240 C680 130 830 80 950 115" />
            <path className="roadmap-surface" d="M65 500 C180 570 330 525 300 405 C270 290 430 250 520 340 C610 430 760 350 720 240 C680 130 830 80 950 115" />
            <path className="roadmap-centre" d="M65 500 C180 570 330 525 300 405 C270 290 430 250 520 340 C610 430 760 350 720 240 C680 130 830 80 950 115" />
          </svg>
          <svg className="roadmap-mobile-road" viewBox="0 0 100 640" preserveAspectRatio="none" aria-hidden="true">
            <path className="roadmap-shadow" d="M35 64 C88 112 82 150 70 192 C55 245 18 270 30 320 C42 372 83 396 68 448 C54 500 26 538 40 576" />
            <path className="roadmap-surface" d="M35 64 C88 112 82 150 70 192 C55 245 18 270 30 320 C42 372 83 396 68 448 C54 500 26 538 40 576" />
            <path className="roadmap-centre" d="M35 64 C88 112 82 150 70 192 C55 245 18 270 30 320 C42 372 83 396 68 448 C54 500 26 538 40 576" />
          </svg>
          {steps.map(([number, title], index) => <article className={`roadmap-stop roadmap-stop-${index + 1}`} key={title}>
            <span className="roadmap-pin"><b>{number}</b></span>
            <div className="roadmap-copy"><h3>{title}</h3></div>
            {index === steps.length - 1 && <span className="roadmap-flight" aria-hidden="true"><PlaneTakeoff size={34} /></span>}
          </article>)}
        </div>
      </section>

      <section id="student-life" className="section life-redesign">
        <div className="section-heading"><div><span className="eyebrow">BEYOND THE TEXTBOOK</span><h2>Life at <em>NXT.</em></h2></div><p>New skills, shared experiences and a little more confidence every day.</p></div>
        <div className="life-media-grid">
          <figure className="life-media-card life-video life-video-one">
            <video controls playsInline preload="metadata" poster="/media/nxt-campus-life-01-poster.jpg" aria-label="A special celebration at NXT Academy">
              <source src="/media/nxt-campus-life-01.mp4" type="video/mp4" />
            </video>
            <figcaption><span>01 · CAMPUS MOMENTS</span><h3>Celebrating together</h3></figcaption>
          </figure>
          <figure className="life-media-card life-photo life-photo-one">
            <Image src="/academy-learning.webp" fill unoptimized sizes="(max-width:760px) 82vw, 34vw" alt="Students learning together" />
            <figcaption><span>02 · THE ACADEMY EXPERIENCE</span><h3>Learn together</h3></figcaption>
          </figure>
          <figure className="life-media-card life-video life-video-two">
            <video controls playsInline preload="metadata" poster="/media/nxt-campus-life-02-poster.jpg" aria-label="A look inside NXT Academy">
              <source src="/media/nxt-campus-life-02.mp4" type="video/mp4" />
            </video>
            <figcaption><span>03 · INSIDE NXT</span><h3>A look around campus</h3></figcaption>
          </figure>
          <figure className="life-media-card life-photo life-photo-two">
            <Image src="/academy-campus.jpeg" fill unoptimized sizes="(max-width:760px) 82vw, 34vw" alt="NXT Academy campus in Mangaluru" />
            <figcaption><span>04 · YOUR CAMPUS</span><h3>A place to begin</h3></figcaption>
          </figure>
        </div>
        <p className="life-swipe-hint" aria-hidden="true">Swipe to explore <ArrowRight size={16} /></p>
      </section>

      <section id="faq" className="section faq-redesign">
        <div className="faq-heading"><span className="eyebrow">HERE TO HELP</span><h2>Questions from students<br /><em>and parents.</em></h2><p>Clear answers for your next step.</p></div>
        <div className="faq-list">{faqs.map(([question, answer], index) => <article key={question}><h3><button onClick={() => setOpenFaq(openFaq === index ? -1 : index)} aria-expanded={openFaq === index} aria-controls={`answer-${index}`}>{question}<ChevronDown className={openFaq === index ? 'rotated' : ''} size={20} /></button></h3><div id={`answer-${index}`} hidden={openFaq !== index}><p>{answer}</p></div></article>)}</div>
      </section>

      <section id="contact" className="section contact-redesign">
        <div className="contact-copy"><span className="eyebrow">START A CONVERSATION</span><h2>Let’s talk about<br /><em>your next step.</em></h2><p>Tell us what you’re interested in. Your enquiry will be prepared for WhatsApp so you can review it before sending.</p><div className="contact-links"><a href="tel:+918217337597"><Phone size={21} /><span><small>CALL ADMISSIONS</small>+91 821 733 7597</span></a><a href="mailto:nxtacademy69@gmail.com"><Mail size={21} /><span><small>EMAIL US</small>nxtacademy69@gmail.com</span></a><div><MapPin size={21} /><span><small>LOCATION</small>Mangaluru, Karnataka</span></div></div></div>
        <form onSubmit={prepareEnquiry} className="enquiry-form"><h3>Your future starts with a conversation.</h3><div className="form-grid"><label>Full name<input name="name" required placeholder="Your name" /></label><label>Phone number<input name="phone" required inputMode="tel" pattern="[0-9+ ]{8,15}" placeholder="Your mobile number" /></label><label>Email address<input name="email" type="email" required placeholder="you@example.com" /></label><label>Current qualification<select name="qualification" required defaultValue=""><option value="" disabled>Select qualification</option><option>10th</option><option>12th</option><option>Other</option></select></label></div><label>Interested course<select name="course" required defaultValue=""><option value="" disabled>Choose your course</option>{programs.map(course => <option key={course.title}>{course.title}</option>)}</select></label><button type="submit" className="form-submit">Prepare enquiry <MessageCircle size={19} /></button>{whatsappUrl && <div className="enquiry-ready"><CircleCheck size={20} /><div><strong>Your enquiry is ready.</strong><p>It has not been sent yet. Review and send it on WhatsApp.</p><a href={whatsappUrl} target="_blank" rel="noopener noreferrer">Open WhatsApp <ArrowUpRight size={17} /></a></div></div>}</form>
      </section>
    </main>

    <footer className="site-footer"><div className="footer-grid"><div><Brand /><p>Practical learning and professional growth for students in Mangaluru.</p></div><div><h3>Explore NXT</h3><a href="#courses">Courses</a><a href="#why-nxt">Why NXT</a><a href="#student-life">Student life</a></div><div><h3>Your next step</h3><a href="#courses">Hospitality</a><a href="#courses">Aviation</a><a href="#contact">Enquire</a><a href="#faq">FAQs</a></div><div><h3>Contact</h3><a href="tel:+918217337597">+91 821 733 7597</a><a href="mailto:nxtacademy69@gmail.com">nxtacademy69@gmail.com</a><a href="https://wa.me/918217337597" target="_blank" rel="noopener noreferrer">WhatsApp <ArrowUpRight size={14} /></a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} NXT Academy of Creative Studies</span><span>Mangaluru, Karnataka</span></div></footer>
    <a className="floating-whatsapp" href="https://wa.me/918217337597" target="_blank" rel="noopener noreferrer" aria-label="Chat with NXT Academy on WhatsApp"><MessageCircle size={23} /></a>
    <ProgramDialog program={program} onClose={() => setProgram(null)} />
  </>;
}
