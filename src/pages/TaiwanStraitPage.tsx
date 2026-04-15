import './TaiwanStraitPage.css';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const risk = [
  { id: 1, type: 'PDF', title: 'Full Report', date: '2026-04-12', pdf: true },
  { id: 3, type: 'PDF', title: 'Overview', date: '2026-04-08', pdf: true },
  { id: 5, type: 'Audio', title: '5-Minute Overview', date: '2026-04-13', pdf: false },
  { id: 7, type: 'Audio', title: '20-Minute Deep Dive', date: '2026-03-30', pdf: false },
];

const scenario = [
  { id: 2, type: 'report', title: 'Scenario Planning Report: Economic Contours Under Sanctions Pressure', date: '2026-04-10', pdf: true },
  { id: 4, type: 'presentation', title: 'Scenario Planning Presentation: Diplomatic Pathways & Red Lines', date: '2026-04-06', pdf: false },
  { id: 6, type: 'audio-5min', title: '5-Minute Scenario Planning Audio Overview', date: '2026-04-11', pdf: false },
  { id: 8, type: 'audio-20min', title: '20-Minute Deep Dive: Scenario Planning Analysis', date: '2026-03-28', pdf: false },
];

export default function TaiwanStraitPage() {
  return (
    <div className="container">
      <div className="taiwan-strait-page">
        <Link to="/dashboard" className="back-link">
          <ArrowLeft className="icon" /> Back to Dashboard
        </Link>

        <header className="page-header">
          <div className="threat-visual">
            <span className="threat-level high">CRITICAL</span>
          </div>
          <h1>Taiwan Strait</h1>
          <p className="description">
            Real-time monitoring and analysis of the Taiwan Strait security environment.
            Covering military posturing, diplomatic developments, and economic impacts.
          </p>
        </header>

        <section className="content-section judgement">
          <h2>Core Judgement</h2>
          <p>The Taiwan Strait is the single highest-consequence fracture point in the global system. A successful Chinese blockade or kinetic action against Taiwan would generate an estimated $10 trillion in first-year global economic damage, collapse the semiconductor supply chain that underpins every advanced economy, and force the most consequential US strategic decision since 1962. The question is not whether this fracture is possible — it is whether the international community has built the decision architecture to manage it before it becomes irreversible.</p>

        </section>

        <section className="content-section">
          <h2>Risk Assessment</h2>
          <div className="content__grid">
            {risk.map(item => (
              <article key={item.id} className={`content-card card ${item.type}`}>
                <div className="card-header">
                  <span className="type-badge">{item.type.replace('-', ' ').toUpperCase()}</span>
                  <span className="date">{item.date}</span>
                </div>
                <h3>{item.title}</h3>
                {item.pdf ? (
                  <a href="#" className="download-link">Download PDF</a>
                ) : (
                  <button className="play-button">▶ Play</button>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="content-section">
          <h2>Scenario Planning</h2>
          <div className="content__grid">
            {scenario.map(item => (
              <article key={item.id} className={`content-card card ${item.type}`}>
                <div className="card-header">
                  <span className="type-badge">{item.type.replace('-', ' ').toUpperCase()}</span>
                  <span className="date">{item.date}</span>
                </div>
                <h3>{item.title}</h3>
                {item.pdf ? (
                  <a href="#" className="download-link">Download PDF</a>
                ) : (
                  <button className="play-button">▶ Play</button>
                )}
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}