import { useState } from 'react';
import './NLTPlus.css';

const benefitItems = [
  {
    title: 'AI-Enhanced Analysis',
    desc: 'Machine learning models trained on decades of geopolitical data to surface hidden patterns.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <path d="M12 2a4 4 0 0 1 4 4c0 1.1-.9 2-2 2h-4a2 2 0 0 1-2-2 4 4 0 0 1 4-4z" />
        <path d="M12 8v4" /><path d="M8 12l4 4 4-4" />
        <circle cx="12" cy="19" r="3" />
        <path d="M8.5 15.5L6 20" /><path d="M15.5 15.5l2.5 4.5" />
      </svg>
    ),
  },
  {
    title: 'Historical Context',
    desc: 'Deep-dive historical excavation that maps past precedents to modern crises.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <circle cx="12" cy="12" r="9" />
        <polyline points="12 6 12 12 16 14" />
        <path d="M3 20.5C3 20.5 5 18 12 18s9 2.5 9 2.5" />
      </svg>
    ),
  },
  {
    title: 'OSINT Experts',
    desc: 'Rigorous OSINT methodologies applied to publicly available documents and signals.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <circle cx="11" cy="11" r="7" />
        <line x1="16.5" y1="16.5" x2="21" y2="21" />
        <line x1="8" y1="11" x2="14" y2="11" />
        <line x1="11" y1="8" x2="11" y2="14" />
      </svg>
    ),
  },
  {
    title: 'Actionable Foresight',
    desc: 'Clear, pragmatic intelligence designed to inform strategy and mitigate risk.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <polygon points="3 11 22 2 13 21 11 13 3 11" />
      </svg>
    ),
  },
];

const offerItems = [
  {
    title: 'Nexus',
    desc: 'Get access all Nexus episodes on demand, ad free.',
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
    title: 'Signal & Fracture',
    desc: 'Prepare for the future with our proprietary foresight framework.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    title: 'OSINT Briefings',
    desc: 'Monthly intelligence briefing from our team of OSINT experts.',
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
    title: 'Expert Knowledge',
    desc: 'Exclusive access to expert analysis of current events.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
];


const plans = [
  { key: 'monthly' as const, name: 'Monthly', price: '$29', period: '/mo', tag: 'Monthly', cta: 'Subscribe Now', highlight: false, savings: '' },
  { key: 'annual' as const, name: 'Annual', price: '$199', period: '/yr', tag: 'Annual', cta: 'Subscribe Now (Save 20%)', highlight: true, savings: 'Save 20%' },
];

export default function NLTPlus() {
  const [plan, setPlan] = useState<'monthly' | 'annual'>('annual');

  return (
    <section id="plus" className="plus section">
      <div className="container">
        <div className="plus__header">
          <h2 className="section-title">Threat+</h2>
          <p className="section-subtitle">Identifies tomorrow's threats and explains today's geopolitical realities through an exclusive subscription platform.</p>
        </div>

        <div className="plus__teasers">
          <div className="card tease-card">
            <div className="tease-card__badge">Podcast Series</div>
            <h3 className="tease-card__title">Nexus</h3>
            <p className="tease-card__desc">Explains today's geopolitical realities through historical excavation.</p>
            <div className="tease-card__player">
              <div className="placeholder-embed">Spotify Embed (Coming Soon)</div>
            </div>
          </div>
          <div className="card tease-card tease-card--signal">
            <div className="tease-card__badge">Intelligence Briefings</div>
            <h3 className="tease-card__title">Signal & Fracture</h3>
            <p className="tease-card__desc">Identifies tomorrow's threats through analysis of open source documentation.</p>
            <div className="tease-card__player">
              <div className="placeholder-embed">PDF Report (Coming Soon)</div>
            </div>
          </div>
        </div>

        <div className="plus__benefits sub-section">
          <h3 className="section-subheader" style={{textAlign: 'center', marginBottom: '3rem'}}>Why Threat+?</h3>
          <div className="benefits__grid">
            {benefitItems.map(b => (
              <div key={b.title} className="card benefit-card">
                <div className="benefit-card__icon">{b.icon}</div>
                <h4 className="benefit-card__title">{b.title}</h4>
                <p className="benefit-card__desc">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="plus__benefits sub-section">
          <h3 className="section-subheader" style={{textAlign: 'center', marginBottom: '3rem'}}>What You Get</h3>
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

        <div className="pricing sub-section" style={{paddingTop: '2rem', paddingBottom: '0'}}>
          <h3 className="section-subheader" style={{textAlign: 'center', marginBottom: '3rem'}}>Pricing</h3>
          <div className="pricing__tabs">
            <button className={`tab ${plan === 'monthly' ? 'active' : ''}`} onClick={() => setPlan('monthly')}>Monthly</button>
            <button className={`tab ${plan === 'annual' ? 'active' : ''}`} onClick={() => setPlan('annual')}>Annual <span className="tab__badge">Save 20%</span></button>
          </div>

          <div className="pricing__cards">
            {plans.map(p => (
              <div key={p.key} className={`pricing__card card${plan === p.key ? ' pricing__card--active' : ''}${p.highlight ? ' pricing__card--highlight' : ''}`}>
                <div className="pricing__tag">
                  {p.tag}
                  {p.savings && <span className="tab__badge">{p.savings}</span>}
                </div>
                <div className="pricing__amount">{p.price}<span className="pricing__period">{p.period}</span></div>
                <button className="btn btn-primary pricing__cta">{p.cta}</button>
              </div>
            ))}
          </div>

          <div className="pricing__mobile-card card">
            <div className="pricing__amount">{plan === 'monthly' ? '$29' : '$199'}<span className="pricing__period">/{plan === 'monthly' ? 'mo' : 'yr'}</span></div>
            <button className="btn btn-primary pricing__cta">Subscribe Now</button>
          </div>
        </div>
      </div>
    </section>
  );
}
