import { useState } from 'react';
import './Nexus.css';

const benefitItems = [
  {
    title: 'OSINT Foundation',
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
    title: 'Expert Analysis',
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
    title: 'Forward Looking',
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
    title: 'Actionable Intel',
    desc: 'Clear, pragmatic intelligence designed to inform strategy and mitigate risk.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <polygon points="3 11 22 2 13 21 11 13 3 11" />
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
    <section id="nexus" className="nexus section">
      <div className="container">
        <div className="nexus__header">
          <h2 className="section-title">Nexus</h2>
          <p className="section-subtitle">Explaining today's geopolitical realities through historical excavation.</p>
        </div>

        <div className="nexus__teasers">
          <div className="card tease-card">
            <div className="tease-card__badge">Audio Series</div>
            <h3 className="tease-card__title">Country Analysis</h3>
            <p className="tease-card__desc">Understand the complexities of the countries at the center of geopolitics.</p>
            <div className="tease-card__player">
              <div className="placeholder-embed">Spotify Embed (Coming Soon)</div>
            </div>
          </div>
          <div className="card tease-card tease-card--signal">
            <div className="tease-card__badge">Actionable Insights</div>
            <h3 className="tease-card__title">Future Outlook</h3>
            <p className="tease-card__desc">Projecting the future based on historical excavation.</p>
            <div className="tease-card__player">
              <div className="placeholder-embed">PDF Report (Coming Soon)</div>
            </div>
          </div>
        </div>

        <div className="plus__benefits sub-section">
          <h3 className="section-subheader" style={{textAlign: 'center', marginBottom: '3rem'}}>Today's Reality, Explained by History.</h3>
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

        {/* <div className="plus__benefits sub-section">
          <h3 className="section-subheader" style={{textAlign: 'center', marginBottom: '3rem'}}>Delivered to Your Inbox</h3>
          <div className="benefits__grid">
            {offerItems.map(b => (
              <div key={b.title} className="card benefit-card">
                <div className="benefit-card__icon">{b.icon}</div>
                <h4 className="benefit-card__title">{b.title}</h4>
                <p className="benefit-card__desc">{b.desc}</p>
              </div>
            ))}
          </div>
        </div> */}

        {/* <div className="pricing sub-section" style={{paddingTop: '2rem', paddingBottom: '0'}}>
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
        </div> */}
      </div>
    </section>
  );
}
