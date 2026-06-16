import './Free.css';
import { Gauge } from '../../components/Gauge';
import { Signup } from '../../components/Signup';

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
  { value: '15', label: 'Podcast Episodes' },
  { value: '16', label: 'Free Watch Reports' },

];

const testimonials = [
  {
    quote: '"Signal & Fracture has quickly become an indispensible part of our workflow. We have a much better understanding of the events that could signficantly impact our operations."',
    name: 'Robert, Managing Partner',
    org: 'Private Equity Firm',
  },
  {
    quote: '"Truth be told, we had not considered a Chief Geopolitical Officer before subscribing to Signal & Fracture. Now we can\'t imagine life without one. There\'s really no alternative to being prepared."',
    name: 'Natalie, Chief Risk Officer',
    org: 'Multinational Corporation',
  }
];

const watchReports = [
  {
    id: 1,
    date: 'June 4th, 2026',
    title: 'Kazakhstan Economy',
    desc: 'Kazakhstan\'s economic diversification will continue to advance in the tech sector but fail to materially reduce hydrocarbon dependence over the next 18 months.',
    probability: 70,
    target_date: 'December 2027',
    url: 'https://pub-70e08d62c8314675b40c42f0fe4be6fb.r2.dev/watch-reports/kazakhstan-economy/2026-06-04.pdf',
  },
  {
    id: 2,
    date: 'June 1st, 2026',
    title: 'Sri Lankan Financial Relationship with China',
    desc: 'Sri Lanka will sign a new bilateral infrastructure financing agreement with China within the next 18 months.',
    probability: 70,
    target_date: 'November 2027',
    url: 'https://pub-70e08d62c8314675b40c42f0fe4be6fb.r2.dev/watch-reports/sri-lankan-financial-relationship-china/2026-06-01.pdf',
  }
];


export default function Free() {
  return (
    <section id="free" className="nexus section">
      <div className="container">
        <div className="nexus__header">
          <h2 className="section-title">Prepare for Tomorrow</h2>
          <p className="section-subtitle">We continuously monitor converging signals across political, economic, military, and technological dimensions, giving organizations the clarity they need to protect their strategic interests.</p>
        </div>

        <div className="">
          <div className="card free-card">
            <div className="free-card__badge">Emerging Threats</div>
            <h3 className="free-card__title">Watch Reports</h3>
            <p className="free-card__desc"> Free, time-stamped intelligence that makes specific, probability-weighted calls about potential geopolitical fracture events. Subscribe to get full access to the archive.</p>
            <div className="free-card__report-grid">
              {watchReports.map(w => (
                <div key={w.id} className="free-card__report">
                  <div className="free-card__report-date">{ w.date }</div>

                  <div className="free-card__report-inner">
                    <div className="free-card__report-main">
                      <div className="free-card__report-title">{ w.title }</div>
                      <div className="free-card__report-desc">{ w.desc }</div>
                    </div>

                    <div className="free-card__report-side">
                      <Gauge score={w.probability} />
                      {/* <div className="free-card__report-target">
                        <strong>Target</strong>
                        <span>{ w.target_date }</span>
                      </div> */}
                    </div>
                  </div>

                  <div className="free-card__report-actions">
                    <a href={w.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">View Report</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card free-card free-card--signal">
            <div className="free-card__signal-inner">
              <div className="free-card__signal-main">
                <div className="free-card__badge">Investigations</div>
                <h3 className="free-card__title">Unresolved Podcast</h3>
                <p className="free-card__desc">A demonstration of the analytical methodology behind Signal & Fracture. In our first investigation, we investigate what we still don't know about the Iran-Contra Affair. Listen on <a href="https://open.spotify.com/show/7ek6y9eWrqBcnORRi7o5Ae?si=fa3becfb61cb4eca" target="_blank" rel="noopener noreferrer">Spotify</a> and <a href="https://podcasts.apple.com/gb/podcast/unresolved/id1891064768" target="_blank" rel="noopener noreferrer">Apple Podcasts</a>.</p>
                <div className="free-card__player">
                  <iframe data-testid="embed-iframe" style={{borderRadius:'12px'}} src="https://open.spotify.com/embed/episode/7KY1Yi9mYeTjMsPdx3WzZx?utm_source=generator" width="100%" height="152" frameBorder="0" allowFullScreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                </div>
              </div>

              <div className="free-card__signal-side">
                <p className="free-card__signal-quote">And at the end of it all — after years of investigation, millions of pages of documents, and hundreds of hours of sworn testimony — some of the most important questions remain unanswered.</p>
              </div>
            </div>
          </div>
          {/* <div className="card free-card free-card--signal">
            <div className="free-card__badge">Critical Analysis</div>
            <h3 className="free-card__title">The Signal & Fracture Podcast</h3>
            <p className="free-card__desc">IScann Group's panel of domain experts discuss key global instabilities, from military and cyber to disinformation and finance.</p>
            <div className="free-card__player">
              <iframe data-testid="embed-iframe" style={{borderRadius:'12px'}} src="https://open.spotify.com/embed/episode/4IYTVQwlnw1vaJEDEwzN9o?utm_source=generator" width="100%" height="152" allowFullScreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
            </div>
          </div> */}
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

        <div id="subscribe" className="plus__benefits sub-section">
          <h3 className="section-subheader" style={{textAlign: 'center', marginBottom: '3rem'}}>Subscribe for Free</h3>
          <div className="newsletter__wrapper">
            <Signup />
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
