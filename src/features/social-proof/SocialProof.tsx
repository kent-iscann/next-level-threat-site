import './SocialProof.css';

const stats = [
  { value: 'TBC', label: 'Active Subscribers' },
  { value: 'TBC', label: 'Nexus Episodes' },
  { value: 'TBC', label: 'Signal & Fracture Briefs' },
];

const testimonials = [
  {
    quote: '"Placeholder — testimonial quote from an early subscriber or client."',
    name: 'Name & Title',
    org: 'Organisation / Company',
  },
  {
    quote: '"Placeholder — testimonial quote about the quality of analysis or foresight."',
    name: 'Name & Title',
    org: 'Organisation / Company',
  },
  {
    quote: '"Placeholder — testimonial quote about how Next Level Threat informed a decision."',
    name: 'Name & Title',
    org: 'Organisation / Company',
  },
];

export default function SocialProof() {
  return (
    <section id="social-proof" className="social-proof section">
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
    </section>
  );
}
