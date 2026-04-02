import { useState } from 'react';
import './NLTPlus.css';

const benefitItems = [
  { title: 'AI-Enhanced Analysis', desc: 'Machine learning models trained on decades of geopolitical data to surface hidden patterns.' },
  { title: 'Historical Context', desc: 'Deep-dive historical excavation that maps past precedents to modern crises.' },
  { title: 'OSINT Experts', desc: 'Rigorous OSINT methodologies applied to publicly available documents and signals.' },
  { title: 'Actionable Foresight', desc: 'Clear, pragmatic intelligence designed to inform strategy and mitigate risk.' },
];

const offerItems = [
  { title: 'Nexus', desc: 'Get access all Nexus episodes on demand, ad free.' },
  { title: 'Signal & Fracture', desc: 'Prepare for the future with our proprietary foresight framework.' },
  { title: 'OSINT Briefing', desc: 'Monthly intelligence briefing from our team of OSINT experts.' },
  { title: 'Expert Knowledge', desc: 'Exclusive access to expert analysis of current events.' },
];

const features = [
  'Full access to Nexus episodes, ad free',
  'Signal & Fracture intelligence briefs (audio and text)',
  'Trend forecasting',
  'Archive access & deep dives',
  'Exclusive OSINT briefings',
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
            <div className="tease-card__badge">Intelligence Brief</div>
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
                <ul className="pricing__features">
                  {features.map(f => <li key={f}>{f}</li>)}
                </ul>
                <button className="btn btn-primary pricing__cta">{p.cta}</button>
              </div>
            ))}
          </div>

          <div className="pricing__mobile-card card">
            <div className="pricing__amount">{plan === 'monthly' ? '$29' : '$199'}<span className="pricing__period">/{plan === 'monthly' ? 'mo' : 'yr'}</span></div>
            <ul className="pricing__features">
              {features.map(f => <li key={f}>{f}</li>)}
            </ul>
            <button className="btn btn-primary pricing__cta">Subscribe Now</button>
          </div>
        </div>
      </div>
    </section>
  );
}
