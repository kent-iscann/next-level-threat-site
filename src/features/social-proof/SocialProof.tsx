import './SocialProof.css';

const stats = [
  { value: '534', label: 'Active Subscribers' },
  { value: '10', label: 'Signal & Fracture Briefs' },
  { value: '24', label: 'Nexus Episodes' },

];

const testimonials = [
  {
    quote: '"Next Level Threat quickly became an indispensible part of our workflow. We have a much better understanding of the regions we deal with and can provide our own clients with a better service."',
    name: 'John, CEO',
    org: 'Think Tank',
  },
  {
    quote: '"Truth be told, we had not considered a Chief Geopolitical Officer before subscribing to Next Level Threat. Now we can\'t imagine life without one. There\'s really no alternative to being prepared."',
    name: 'Jane, COO',
    org: 'Investment Fund',
  },
  {
    quote: '"What amazes me about Next Level Threat is their ability to identify geopolitical hotspots that are not on anyone\'s radar. And when something big does break, the analysis they put together is top notch."',
    name: 'Jack, Founder',
    org: 'New Media Company',
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
