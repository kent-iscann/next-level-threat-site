import React, { useState } from 'react';
import './NLTPlus.css';

const benefits = [
  { icon: '🔍', title: 'AI-Enhanced Analysis', desc: 'Machine learning models trained on decades of geopolitical data to surface hidden patterns.' },
  { icon: '📜', title: 'Historical Context', desc: 'Deep-dive historical excavation that maps past precedents to modern crises.' },
  { icon: '🌐', title: 'OSINT Experts', desc: 'Rigorous OSINT methodologies applied to publicly available documents and signals.' },
  { icon: '🚀', title: 'Actionable Foresight', desc: 'Clear, pragmatic intelligence designed to inform strategy and mitigate risk.' },
];

const offer = [
  { icon: '🔍', title: 'Nexus', desc: 'Get access all Nexus episodes on demand, ad free.' },
  { icon: '📜', title: 'Signal & Fracture', desc: 'Prepare for the future with our proprietary foresight framework.' },
  { icon: '🌐', title: 'OSINT Briefing', desc: 'Monthly intelligence briefing from our team of OSINT experts.' },
  { icon: '🚀', title: 'Expert Knowledge', desc: 'Exclusive access to expert analysis of current events.' },
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
            {benefits.map(b => (
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
            {offer.map(b => (
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
            <div className="pricing__card card">
              <div className="pricing__tag">Monthly</div>
              <div className="pricing__amount">$29<span className="pricing__period">/mo</span></div>
              <button className="btn btn-primary pricing__cta">Subscribe Now</button>
            </div>
            <div className="pricing__card card pricing__card--highlight">
              <div className="pricing__tag">Annual <span className="tab__badge">Save 20%</span></div>
              <div className="pricing__amount">$199<span className="pricing__period">/yr</span></div>
              <button className="btn btn-primary pricing__cta">Subscribe Now (Save 20%)</button>
            </div>
          </div>

          <div className="pricing__mobile-card card">
            <div className="pricing__amount">{plan === 'monthly' ? '$29' : '$199'}<span className="pricing__period">/{plan === 'monthly' ? 'mo' : 'yr'}</span></div>
            <ul className="pricing__features">
              <li>Full access to Nexus episodes, ad free</li>
              <li>Signal & Fracture intelligence briefs (audio and text)</li>
              <li>Trend forecasting</li>
              <li>Archive access & deep dives</li>
              <li>Exclusive OSINT briefings</li>
            </ul>
            <button className="btn btn-primary pricing__cta">Subscribe Now</button>
          </div>
        </div>
      </div>
    </section>
  );
}