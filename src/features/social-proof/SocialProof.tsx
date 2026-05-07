import './SocialProof.css';

const stats = [
  { value: '534', label: 'Subscribers' },
  { value: '10', label: 'Risk & Scenario Assessments' },
  { value: '24', label: 'Free Signal Watch Briefs' },

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

export default function SocialProof() {
  return (
    <section id="social-proof" className="social-proof">
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
