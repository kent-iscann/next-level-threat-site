import './Nexus.css';

const benefitItems = [
  {
    title: 'Watch Reports',
    desc: 'Full access to our archive of past Watch Reports, plus new reports as they are published.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    title: 'Weekly Briefings',
    desc: 'Updates from our experts on identified areas of geopolitical interest.',
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
    title: 'Podcast Episodes',
    desc: 'Early access to new episodes of our podcasts.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <polygon points="10 7 10 13 15 10 10 7" />
        <line x1="6" y1="21" x2="18" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
];

const stats = [
  { value: '137', label: 'Subscribers' },
  { value: '38', label: 'Podcast Episodes' },
  { value: '2', label: 'Free Watch Reports' },

];

const testimonials = [
  {
    quote: '"Signal & Fracture quickly became an indispensible part of our workflow. We have a much better understanding of the regions we deal with and can provide our own clients with a better service."',
    name: 'John, Managing Partner',
    org: 'Private Equity Firm',
  },
  {
    quote: '"Truth be told, we had not considered a Chief Geopolitical Officer before subscribing to Signal & Fracture. Now we can\'t imagine life without one. There\'s really no alternative to being prepared."',
    name: 'Jane, Chief Risk Officer',
    org: 'Multinational Corporation',
  }
];

const watchReports = [
  {
    id: 1,
    date: 'May 6th, 2026',
    title: 'Houthi Ceasefire',
    desc: 'Red Sea interdiction resumes at scale before July 30th, 2026.',
  },
  {
    id: 2,
    date: 'May 3rd, 2026',
    title: 'Mali Coup d\'Etat',
    desc: 'Army retakes control before June 12th, 2026.',
  }
];


export default function Nexus() {
  return (
    <section id="nexus" className="nexus section">
      <div className="container">
        <div className="nexus__header">
          <h2 className="section-title">Prepare for Tomorrow</h2>
          <p className="section-subtitle">We continuously monitor converging signals across political, economic, social, technological, and environmental domains, giving organizations the clarity they need to protect their assets, people, operations, and strategic interests.</p>
        </div>

        <div className="">
          <div className="card free-card">
            <div className="free-card__badge">Emerging Threats</div>
            <h3 className="free-card__title">Watch Reports</h3>
            <p className="free-card__desc"> Free, time-stamped intelligence that makes specific, probability-weighted calls about potential geopolitical fracture events. Subscribe to get full access to the archive.</p>
            <div className="free-card__report-grid">
              {watchReports.map(w => (
                <div key={w.id} className="free-card__report">
                  <div className="free-card__report-badge">{ w.date }</div>
                  <div className="free-card__report-title">{ w.title }</div>
                  <div className="free-card__report-desc">{ w.desc }</div>
                  <button className="btn btn-secondary">View Report</button>
                </div>
              ))}
            </div>
          </div>
          <div className="card free-card free-card--signal">
            <div className="free-card__badge">Critical Analysis</div>
            <h3 className="free-card__title">The Signal & Fracture Podcast</h3>
            <p className="free-card__desc">IScann Group's panel of domain experts discuss key global instabilities, from military and cyber to disinformation and finance.</p>
            <div className="free-card__player">
              <iframe data-testid="embed-iframe" style={{borderRadius:'12px'}} src="https://open.spotify.com/embed/episode/4IYTVQwlnw1vaJEDEwzN9o?utm_source=generator" width="100%" height="152" frameBorder="0" allowFullScreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
            </div>
          </div>
          <div className="card free-card free-card--signal">
            <div className="free-card__badge">Investigations</div>
            <h3 className="free-card__title">Resolved Podcast</h3>
            <p className="free-card__desc">A demonstration of the analytical methodology behind Signal & Fracture. For our first investigation, we examine the Iran-Contra Affair.</p>
            <div className="free-card__player">
              <iframe data-testid="embed-iframe" style={{borderRadius:'12px'}} src="https://open.spotify.com/embed/episode/7KY1Yi9mYeTjMsPdx3WzZx?utm_source=generator" width="100%" height="152" frameBorder="0" allowFullScreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
            </div>
          </div>
        </div>

        <div className="plus__benefits sub-section">
          <h3 className="section-subheader" style={{textAlign: 'center', marginBottom: '3rem'}}>Subscribers Get</h3>
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

        <div id="social-proof" className="social-proof sub-section">
          <h3 className="section-subheader" style={{textAlign: 'center', marginBottom: '3rem'}}>Our Track Record</h3>
          <div className="container">
            <div className="stats__row">
              {stats.map(s => (
                <div key={s.label} className="stat">
                  <div className="stat__value">{s.value}</div>
                  <div className="stat__label">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="testimonials__row">
              {testimonials.map((t, i) => (
                <div key={i} className="testimonial">
                  <p className="testimonial__quote">{t.quote}</p>
                  <div className="testimonial__author">
                    <span className="testimonial__name">{t.name}</span>
                    <span className="testimonial__org">{t.org}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="plus__benefits sub-section">
          <h3 className="section-subheader" style={{textAlign: 'center', marginBottom: '3rem'}}>Subscribe for Free</h3>
          <div className="newsletter__inner">
            <form
              className="newsletter__form"
              onSubmit={(e) => {
                e.preventDefault();
                // Placeholder — wire up email provider at launch
                alert('Thanks — placeholder signup. Real integration coming soon.');
              }}
            >
              <input
                type="email"
                placeholder="your@email.com"
                required
                className="newsletter__input"
                aria-label="Email address"
              />
              <button type="submit" className="btn btn-primary newsletter__btn">
                Subscribe
              </button>
            </form>
            <p className="newsletter__note">
              One email per week. No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>

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
