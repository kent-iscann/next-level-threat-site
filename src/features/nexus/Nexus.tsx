import './Nexus.css';

const benefitItems = [
  {
    title: 'Audio Series',
    desc: 'In-depth country analysis delivered as engaging audio episodes.',
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
    title: 'Future Analysis',
    desc: 'Projection of future scenarios based on historical patterns and current indicators.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <circle cx="12" cy="12" r="9" />
        <polyline points="12 6 12 12 16 14" />
        <path d="M3 20.5C3 20.5 5 18 12 18s9 2.5 9 2.5" />
      </svg>
    ),
  },
  {
    title: 'Intelligence Briefs',
    desc: 'Timely updates and analysis on the countries covered by Nexus.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <circle cx="11" cy="11" r="7" />
        <line x1="16.5" y1="16.5" x2="21" y2="21" />
        <line x1="8" y1="11" x2="14" y2="11" />
        <line x1="11" y1="8" x2="11" y2="14" />
      </svg>
    ),
  },
];


export default function NLTPlus() {
  return (
    <section id="nexus" className="nexus section">
      <div className="container">
        <div className="nexus__header">
          <h2 className="section-title">Nexus</h2>
          <p className="section-subtitle">Our proprietary OSINT framework. We explain today's geopolitical realities and future possibilities through deep historical excavation.</p>
        </div>

        <div className="nexus__teasers">
          <div className="card tease-card">
            <div className="tease-card__badge">Country Analysis</div>
            <h3 className="tease-card__title">The Full Story</h3>
            <p className="tease-card__desc">We help you understand the nuanced complexities of the countries at the center of geopolitics. What makes them tick, why their current actions can be explained by history, and what the future might hold.</p>
            {/* <div className="tease-card__player">
              <div className="placeholder-embed">
                <audio controls>
                  <source src="Nexus - Iran - Episode 1.mp3" type="audio/mpeg" />
                  Your browser does not support the audio tag.
                </audio>
              </div>
            </div> */}
          </div>
          <div className="card tease-card tease-card--signal">
            <div className="tease-card__badge">Future Outlook</div>
            <h3 className="tease-card__title">Actionable Insights</h3>
            <p className="tease-card__desc">We use our knowledge of historical patterns to identify likely future behaviors and outcomes.</p>
            {/* <div className="tease-card__player">
              <div className="placeholder-embed">PDF Report (Coming Soon)</div>
            </div> */}
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
