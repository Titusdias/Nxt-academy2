'use client';

import Image from 'next/image';
import { FormEvent, useState } from 'react';
import {
  ArrowRight, ArrowUpRight, BookOpen, BriefcaseBusiness,
  ChevronDown, CircleCheck, Mail, MapPin,
  MessageCircle, Minus, Phone, Plus, Users,
} from 'lucide-react';
import ReferenceHero, { AcademyHeader } from './components/ReferenceHero';
import ProgramDialog from './components/ProgramDialog';
import { Brand } from './components/AcademyUI';

const advantages = [
  { title: 'Practical Learning', text: 'Learn through activity-based training and hands-on sessions.', detail: 'Presentations, role play, group activities and practical demonstrations help you put learning into action.', image: '/academy-learning.webp', imageAlt: 'Students taking part in a practical learning session' },
  { title: 'Professional Development', text: 'Build communication, confidence and professional presentation.', detail: 'Practise communication, professional grooming and confident participation in a supportive environment.', image: '/nxt-classroom-hero.webp', imageAlt: 'Students developing professional skills in class' },
  { title: 'Industry-Relevant Skills', text: 'Build a foundation in service and industry-focused skills.', detail: 'Develop guest relations, passenger service, administration and professional communication skills.', image: '/academy-campus.jpeg', imageAlt: 'NXT Academy campus for industry-focused learning' },
  { title: 'Career-Focused Approach', text: 'Learn with a clear direction for your next professional step.', detail: 'Connect your learning with the aviation, hospitality and hospital administration roles that interest you.', image: '/academy-learning.webp', imageAlt: 'Students preparing together for their careers' },
];

const advantageIcons = [BookOpen, Users, BriefcaseBusiness, CircleCheck];

const programs = [
  { title: 'BBA in Aviation and Hospitality Management', duration: '3 years', detail: 'Aviation · Hospitality · Management', image: '/course-bba-aviation.png' },
  { title: 'Diploma in Aviation and Hospitality Management', duration: '1 year', detail: 'Guest service · Aviation · Communication', image: '/course-diploma-hospitality.png' },
  { title: 'Diploma in Hospital Administration', duration: '1 year', detail: 'Healthcare service · Administration', image: '/course-hospital-admin.png' },
];

const admissionsWhatsApp = 'https://wa.me/918217337597?text=Hello%20NXT%20Academy%2C%20I%20would%20like%20to%20enquire%20about%20admissions.';

const steps = [
  ['01', 'Discover', 'Understand your interests and direction.'],
  ['02', 'Learn', 'Build a strong foundation of skills.'],
  ['03', 'Practice', 'Apply learning through guided activities.'],
  ['04', 'Grow', 'Develop confidence and professionalism.'],
  ['05', 'Prepare', 'Get ready for your next career step.'],
];

const faqs = [
  ['Who can apply to NXT Academy?', 'Students who have completed SSLC or PUC and are interested in aviation, hospitality or hospital administration can enquire. Admissions will confirm program-specific requirements.'],
  ['What courses are offered?', 'NXT Academy offers a 3-year BBA in Aviation and Hospitality Management, a 1-year Diploma in Aviation and Hospitality Management, and a 1-year Diploma in Hospital Administration.'],
  ['Does the training include practical sessions?', 'Yes. The learning experience includes presentations, communication practice, role play, group activities and practical demonstrations.'],
  ['How do I know which course suits me?', 'Speak with the admissions team about your interests, educational background and career direction. They can explain each program before you decide.'],
  ['Where is NXT Academy located?', 'NXT Academy of Creative Studies is in Mangaluru, Karnataka. Contact admissions for the exact campus address and directions.'],
  ['How can I enquire about admissions?', 'Call or WhatsApp +91 821 733 7597, email nxtacademy69@gmail.com, or use the enquiry form below.'],
];

export default function Home() {
  const [program, setProgram] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState(0);
  const [openAdvantage, setOpenAdvantage] = useState<number | null>(null);
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
      data.get('message') ? `Question: ${data.get('message')}` : '',
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
          <h2>Choose your direction</h2>
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
        <div className="why-graphic-list">{advantages.map(({ title, text, detail }, index) => {
          const AdvantageIcon = advantageIcons[index];
          const isOpen = openAdvantage === index;
          return <button type="button" className={`why-graphic-item${isOpen ? ' is-open' : ''}`} key={title} onClick={() => setOpenAdvantage(isOpen ? null : index)} aria-expanded={isOpen}>
            <span className="why-graphic-icon" aria-hidden="true"><AdvantageIcon size={31} strokeWidth={1.7} /></span>
            <span className="why-graphic-copy"><span className="advantage-index">0{index + 1}</span><h3>{title}</h3><p>{text}</p>
            {isOpen && <span className="advantage-detail">{detail}</span>}</span>
            <span className="why-graphic-toggle" aria-hidden="true">{isOpen ? <Minus size={20} /> : <Plus size={20} />}</span>
          </button>;
        })}</div>
      </section>

      <section className="section experience-redesign">
        <div className="experience-copy"><span className="eyebrow">THE LEARNING EXPERIENCE</span><h2>Less watching.<br /><em>More doing.</em></h2><p>Practical activities make it easier to understand, remember and confidently use what you learn.</p><div className="activity-list">{['Presentation practice', 'Communication sessions', 'Role play & group activities', 'Professional grooming', 'Practical demonstrations', 'Career guidance'].map(item => <span key={item}><CircleCheck size={18} />{item}</span>)}</div></div>
      </section>

      <section className="section journey-redesign">
        <div><span className="eyebrow">YOUR PROGRESS</span><h2>From student to<br /><em>career-ready.</em></h2></div>
        <div className="journey-steps">{steps.map(([number, title, text]) => <article key={title}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
      </section>

      <section id="student-life" className="section life-redesign">
        <div className="section-heading"><div><span className="eyebrow">BEYOND THE TEXTBOOK</span><h2>Life at <em>NXT.</em></h2></div><p>New skills, shared experiences and a little more confidence every day.</p></div>
        <div className="life-grid">
          <figure className="life-main"><Image src="/academy-learning.webp" fill unoptimized sizes="(max-width:760px) 100vw, 60vw" alt="Students learning together" /><figcaption><span>01 · THE ACADEMY EXPERIENCE</span><h3>Learn together</h3></figcaption></figure>
          <figure><Image src="/nxt-classroom-hero.webp" fill unoptimized sizes="(max-width:760px) 100vw, 35vw" alt="A student building confidence in class" /><figcaption><span>02 · PROFESSIONAL GROWTH</span><h3>Find your voice</h3></figcaption></figure>
          <figure><Image src="/academy-campus.jpeg" fill unoptimized sizes="(max-width:760px) 100vw, 35vw" alt="NXT Academy campus in Mangaluru" /><figcaption><span>03 · YOUR CAMPUS</span><h3>A place to begin</h3></figcaption></figure>
        </div>
      </section>

      <section id="admissions" className="section admissions-redesign">
        <div><span className="eyebrow">WHO CAN APPLY?</span><h2>Finished SSLC or PUC?<br /><em>Your next chapter is here.</em></h2><p>Explore practical, career-focused training in aviation, hospitality and hospital administration. Our admissions team can help you understand each program and its requirements.</p><a className="primary-action" href={admissionsWhatsApp} target="_blank" rel="noopener noreferrer">Talk to admissions <ArrowRight size={18} /></a></div>
        <div className="admissions-card"><span>YOUR STARTING POINT</span><strong>SSLC <em>&amp;</em> PUC</strong><p>Your interests. Your skills.<br />A direction that’s yours.</p><small>Program-specific eligibility is confirmed by admissions.</small></div>
      </section>

      <section className="section parent-redesign">
        <div><span className="eyebrow">FOR PARENTS &amp; GUARDIANS</span><h2>A clearer next step<br /><em>for their future.</em></h2><p>Choosing a course after school is an important family decision. Get a clear understanding of the training, activities and expectations before enrolment.</p><a href={admissionsWhatsApp} target="_blank" rel="noopener noreferrer" className="inline-link">Speak with admissions <ArrowRight size={18} /></a></div>
        <div className="parent-points"><article><BookOpen /><div><h3>Learning with structure</h3><p>Understand the program, learning activities and expectations.</p></div></article><article><BriefcaseBusiness /><div><h3>Skills with practical value</h3><p>Training focused on communication, service and professional readiness.</p></div></article><article><Users /><div><h3>Confidence through participation</h3><p>A supportive environment for communication, presentation and growth.</p></div></article></div>
      </section>

      <section id="faq" className="section faq-redesign">
        <div className="faq-heading"><span className="eyebrow">HERE TO HELP</span><h2>Questions from students<br /><em>and parents.</em></h2><p>Clear answers for your next step.</p></div>
        <div className="faq-list">{faqs.map(([question, answer], index) => <article key={question}><h3><button onClick={() => setOpenFaq(openFaq === index ? -1 : index)} aria-expanded={openFaq === index} aria-controls={`answer-${index}`}>{question}<ChevronDown className={openFaq === index ? 'rotated' : ''} size={20} /></button></h3><div id={`answer-${index}`} hidden={openFaq !== index}><p>{answer}</p></div></article>)}</div>
      </section>

      <section id="contact" className="section contact-redesign">
        <div className="contact-copy"><span className="eyebrow">START A CONVERSATION</span><h2>Let’s talk about<br /><em>your next step.</em></h2><p>Tell us what you’re interested in. Your enquiry will be prepared for WhatsApp so you can review it before sending.</p><div className="contact-links"><a href="tel:+918217337597"><Phone size={21} /><span><small>CALL ADMISSIONS</small>+91 821 733 7597</span></a><a href="mailto:nxtacademy69@gmail.com"><Mail size={21} /><span><small>EMAIL US</small>nxtacademy69@gmail.com</span></a><div><MapPin size={21} /><span><small>LOCATION</small>Mangaluru, Karnataka</span></div></div></div>
        <form onSubmit={prepareEnquiry} className="enquiry-form"><h3>Your future starts with a conversation.</h3><div className="form-grid"><label>Full name<input name="name" required placeholder="Your name" /></label><label>Phone number<input name="phone" required inputMode="tel" pattern="[0-9+ ]{8,15}" placeholder="Your mobile number" /></label><label>Email address<input name="email" type="email" required placeholder="you@example.com" /></label><label>Current qualification<select name="qualification" required defaultValue=""><option value="" disabled>Select qualification</option><option>SSLC</option><option>PUC</option><option>Other</option></select></label></div><label>Interested course<select name="course" required defaultValue=""><option value="" disabled>Choose your course</option>{programs.map(course => <option key={course.title}>{course.title}</option>)}</select></label><label>Your message <span>(optional)</span><textarea name="message" rows={3} placeholder="What would you like to know?" /></label><button type="submit" className="form-submit">Prepare enquiry <MessageCircle size={19} /></button>{whatsappUrl && <div className="enquiry-ready"><CircleCheck size={20} /><div><strong>Your enquiry is ready.</strong><p>It has not been sent yet. Review and send it on WhatsApp.</p><a href={whatsappUrl} target="_blank" rel="noopener noreferrer">Open WhatsApp <ArrowUpRight size={17} /></a></div></div>}</form>
      </section>
    </main>

    <footer className="site-footer"><div className="footer-grid"><div><Brand /><p>Practical learning and professional growth for students in Mangaluru.</p></div><div><h3>Explore NXT</h3><a href="#courses">Courses</a><a href="#why-nxt">Why NXT</a><a href="#student-life">Student life</a></div><div><h3>Your next step</h3><a href="#courses">Hospitality</a><a href="#courses">Aviation</a><a href="#admissions">Admissions</a><a href="#faq">FAQs</a></div><div><h3>Contact</h3><a href="tel:+918217337597">+91 821 733 7597</a><a href="mailto:nxtacademy69@gmail.com">nxtacademy69@gmail.com</a><a href="https://wa.me/918217337597" target="_blank" rel="noopener noreferrer">WhatsApp <ArrowUpRight size={14} /></a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} NXT Academy of Creative Studies</span><span>Mangaluru, Karnataka</span></div></footer>
    <a className="floating-whatsapp" href="https://wa.me/918217337597" target="_blank" rel="noopener noreferrer" aria-label="Chat with NXT Academy on WhatsApp"><MessageCircle size={23} /></a>
    <ProgramDialog program={program} onClose={() => setProgram(null)} />
  </>;
}
