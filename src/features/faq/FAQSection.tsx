import { useState } from 'react';
import './FAQSection.css';

const faqItems = [
  {
    question: 'What is OSINT?',
    answer:
      'OSINT stands for Open-Source Intelligence. It refers to the collection and analysis of information from publicly available sources — government reports, satellite imagery, social media, commercial databases, academic research — to produce actionable intelligence.',
  },
  {
    question: 'Is there a free trial?',
    answer: 'Placeholder — we are currently evaluating our free trial policy. Stay tuned for updates.',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer:
      'Placeholder — details of the cancellation policy will be finalised before launch. Expect a straightforward, no-hassle process.',
  },
  {
    question: 'How is Next Level Threat different from reading mainstream news?',
    answer:
      'Headline news tells you what happened today. Threat+ examines the historical, structural, and informational forces that made it inevitable. Our analysis draws on decades of precedent, multi-source OSINT methodology, and AI-assisted pattern detection across open data — far beyond the daily cycle.',
  },
  {
    question: 'Who produces the content?',
    answer:
      'Threat+ is a flagship product of IScann Group, a geopolitical intelligence consultancy with deep expertise in Sahel-region security, OSINT verification, and historical analysis. All content is produced in-house.',
  },
  {
    question: 'What format does Signal & Fracture take?',
    answer:
      'Placeholder — Signal & Fracture will be delivered as a detailed intelligence briefing (PDF and/or audio). Format details will be confirmed at launch.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="faq section">
      <div className="container">
        <div className="faq__header">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">
            Everything you need to know before subscribing. Can't find your answer? Reach out to us at{' '}
            <a href="mailto:placeholder@example.com" className="faq__link">
              placeholder@example.com
            </a>
            .
          </p>
        </div>

        <dl className="faq__list">
          {faqItems.map((item, i) => (
            <dt key={item.question} className="faq__item">
              <button
                className="faq__question"
                aria-expanded={openIndex === i}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span>{item.question}</span>
                <svg
                  className={`faq__chevron${openIndex === i ? ' faq__chevron--open' : ''}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="20"
                  height="20"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div className={`faq__answer${openIndex === i ? ' faq__answer--open' : ''}`}>
                <p>{item.answer}</p>
              </div>
            </dt>
          ))}
        </dl>
      </div>
    </section>
  );
}
