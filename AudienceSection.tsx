import './AudienceSection.css';

const audiences = [
  {
    title: 'Risk Professionals',
    description: 'If your job involves assessing geopolitical risk, threat landscapes, or regional instability — this saves you research hours.',
  },
  {
    title: 'Intelligence Analysts',
    description: 'OSINT-driven analysis with historical depth. Supplement your own workflow with independent sourcing.',
  },
  {
    title: 'Investors & Fund Managers',
    description: 'Stay ahead of geopolitical events that move markets. Understand the structural forces behind the headlines.',
  },
  {
    title: 'Journalists & Researchers',
    description: 'Deep-dive historical context and primary-document analysis to strengthen your own reporting.',
  },
];

export default function AudienceSection() {
  return (
    <section id="audience" className="audience section">
      <div className="container">
        <div className="audience__header">
          <h2 className="section-title">Designed for Professionals</h2>
          <p className="section-subtitle">
            Built for people whose work depends on understanding global shifts before they become headlines.
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
