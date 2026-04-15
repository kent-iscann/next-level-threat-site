import './TaiwanStraitPage.css';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const mockTimeline = [
  { id: 1, type: 'report', title: 'Risk Assessment Report: Cross-Strait Military Posturing', date: '2026-04-12', pdf: true },
  { id: 2, type: 'report', title: 'Scenario Planning Report: Economic Contours Under Sanctions Pressure', date: '2026-04-10', pdf: true },
  { id: 3, type: 'presentation', title: 'Risk Assessment Presentation: Key Drivers & Early Warning Indicators', date: '2026-04-08', pdf: false },
  { id: 4, type: 'presentation', title: 'Scenario Planning Presentation: Diplomatic Pathways & Red Lines', date: '2026-04-06', pdf: false },
  { id: 5, type: 'audio-5min', title: '5-Minute Risk Assessment Audio Overview', date: '2026-04-13', pdf: false },
  { id: 6, type: 'audio-5min', title: '5-Minute Scenario Planning Audio Overview', date: '2026-04-11', pdf: false },
  { id: 7, type: 'audio-20min', title: '20-Minute Deep Dive: Risk Assessment Analysis', date: '2026-03-30', pdf: false },
  { id: 8, type: 'audio-20min', title: '20-Minute Deep Dive: Scenario Planning Analysis', date: '2026-03-28', pdf: false },
];

export default function TaiwanStraitPage() {
  return (
    <div className="taiwan-strait-page">
      <Link to="/dashboard" className="back-link">
        <ArrowLeft className="icon" /> Back to Dashboard
      </Link>

      <header className="page-header">
        <div className="threat-visual">
          <span className="threat-level high">HIGH</span>
        </div>
        <h1>Taiwan Strait</h1>
        <p className="description">
          Real-time monitoring and analysis of the Taiwan Strait security environment.
          Covering military posturing, diplomatic developments, and economic impacts.
        </p>
      </header>

      <section className="content-section">
        <h2>Content Library</h2>
        {mockTimeline.map(item => (
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
      </section>
    </div>
  );
}