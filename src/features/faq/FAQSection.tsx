import { useState } from 'react';
import './FAQSection.css';

const faqItems = [
  {
    question: 'What is Signal & Fracture?',
    answer:
      'Signal & Fracture is a subscription service that delivers forward-looking geopolitical intelligence. Its flagship solution, Risk & Scenario, is a structured early-warning framework that helps clients act before risk becomes crisis',
  },
  {
    question: 'Is there a free trial?',
    answer: 'We have a demo version available for public viewing, which includes access to a selection of content.',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer:
      'Yes, absolutely. We offer flexible subscription plans with no long-term commitments. You can cancel your subscription at any time through your account settings or by contacting our support team.',
  },
  {
    question: 'How is Signal & Fracture different from traditional geopolitical intelligence consultancies?',
    answer:
      'Signal & Fracture provides institutional-quality geopolitical intelligence, delivered in subscription and bespoke formats, at a price point below traditional consultancies',
  },
  {
    question: 'Who produces the content?',
    answer:
      'Signal & Fracture is a flagship solution by IScann Group, a geopolitical intelligence consultancy with deep expertise in geopolitical risk analysis and OSINT investigation. All content is produced in-house.',
  },
  {
    question: 'What format does Signal & Fracture take?',
    answer:
      'We offer a variety of formats, including full report and overview PDFs, as well as audio overviews and deep-dives. Our content is available via the subscriber dashboard and delivered by email.',
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
            <a href="mailto:sf@iscanngroup.com" className="faq__link">
              sf@iscanngroup.com
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
