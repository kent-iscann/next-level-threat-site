import './Inbox.css';

const offerItems = [
  {
    title: 'Signal & Fracture',
    desc: 'Risk assessments and analysis.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <polygon points="10 7 10 13 15 10 10 7" />
        <line x1="6" y1="21" x2="18" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    title: 'Nexus',
    desc: 'Podcast episodes, ad free.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    title: 'Weekly Briefings',
    desc: 'Intelligence updates from our team of experts.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    ),
  },
  {
    title: 'Quarterly Updates',
    desc: 'Recap of the most important developments and things to watch.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
];

export default function SocialProof() {
  return (
    <section id="social-proof" className="social-proof section">
      <div className="container">
        <div className="audience__header">
          <h2 className="section-title">Delivered to Your Inbox,<br />Available On-Demand</h2>
          <p className="section-subtitle">
            Our intelligence the way you want it.
          </p>
        </div>

        <div className="benefits__grid">
          {offerItems.map(b => (
            <div key={b.title} className="card benefit-card">
              <div className="benefit-card__icon">{b.icon}</div>
              <h4 className="benefit-card__title">{b.title}</h4>
              <p className="benefit-card__desc">{b.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
