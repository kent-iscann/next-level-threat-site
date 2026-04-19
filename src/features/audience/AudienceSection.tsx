import './AudienceSection.css';

const audiences = [
  {
    title: 'International Finance',
    description: 'Asset managers, hedge funds, family offices, and private equity firms making high-leverage decisions.',
  },
  {
    title: 'Corporate Strategy & Compliance',
    description: 'Strategic planners and compliance officers seeking to understand geopolitical risks.',
  },
  {
    title: 'Chief Risk Officers',
    description: 'Risk management professionals who need every edge to stay ahead.',
  },
];

export default function AudienceSection() {
  return (
    <section id="audience" className="audience section">
      <div className="container">
        <div className="audience__header">
          <h2 className="section-title">Designed for a Global Scope</h2>
          <p className="section-subtitle">
            Tailored for organisations and individuals operating in geopolitically sensitive environments.
          </p>
        </div>

        <div className="audience__grid">
          {audiences.map(a => (
            <div key={a.title} className="audience__card">
              <h3 className="audience__card-title">{a.title}</h3>
              <p className="audience__card-desc">{a.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
