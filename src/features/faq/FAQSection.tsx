import { useState } from 'react';
import './FAQSection.css';

const faqItems = [
  {
    question: 'What is Signal & Fracture?',
    answer:
      'Signal & Fracture is a free subscription service that delivers forward-looking geopolitical intelligence in the form of Watch Reports, briefings, and podcast episodes. Its paid offering, Signal & Fracture Pro, is a structured early-warning framework that helps clients act before risk becomes crisis',
  },
  {
    question: 'Do I need to pay?',
    answer: 'No. We currently offer a free subscription to our Signal & Fracture intelligence. In the near future, we will be adding a paid offering called Signal & Fracture Pro.',
  },
  {
    question: 'How often will I receive intelligence reports?',
    answer: 'We send out Watch Reports and briefings by email once per week. Our podcast episodes are released sporadically, usually once or twice per quarter.',
  },
  {
    question: 'Is there an archive of past Watch Reports?',
    answer: 'Yes, we maintain an archive of all past Watch Reports that subscribers can access at any time.',
  },
  {
    question: 'Can I unsubscribe anytime?',
    answer:
      'Yes, absolutely. Use the unsubscribe link in any of our emails.',
  },
  {
    question: 'How is Signal & Fracture Pro different from traditional geopolitical intelligence consultancies?',
    answer:
      'Signal & Fracture Pro provides institutional-quality geopolitical intelligence, delivered in general and bespoke formats, at a price point below traditional consultancies',
  },
  {
    question: 'Who produces the content?',
    answer:
      'Signal & Fracture is a flagship solution by IScann Group, a geopolitical intelligence consultancy with deep expertise in geopolitical risk analysis and OSINT investigation. All content is produced in-house.',
  }
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
            <a href="mailto:info@iscanngroup.com" className="faq__link">
              info@iscanngroup.com
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
