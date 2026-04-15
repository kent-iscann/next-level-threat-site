import './TaiwanStraitPage.css';
import { ArrowLeft, FileText, Play, Presentation, Headphones, ArrowUpRight, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const REGION_RISK = 92;

const riskAssessment = [
  {
    id: 1,
    type: 'pdf',
    title: 'Full Report: Military Posturing and Economic Signaling',
    description: 'Comprehensive analysis of PLA amphibious readiness drills and semiconductor supply chain risk.',
    date: '12/04/2026',
  },
  {
    id: 5,
    type: 'audio',
    title: '5-Minute Overview',
    description: 'Quick briefing on the current threat posture and key indicators to watch.',
    date: '13/04/2026',
  },
  {
    id: 3,
    type: 'pdf',
    title: 'Overview: Cross-Strait Dynamics',
    description: 'Summary of recent diplomatic movements and their implications for regional stability.',
    date: '08/04/2026',
  },
  {
    id: 7,
    type: 'audio',
    title: '20-Minute Deep Dive',
    description: 'Extended analysis of military exercises, economic leverage points, and US force posture.',
    date: '30/03/2026',
  },
];

const scenarioPlanning = [
  {
    id: 2,
    type: 'report',
    title: 'Economic Contours Under Sanctions Pressure',
    description: 'Scenario modeling of trade disruption cascades and secondary economic effects.',
    date: '10/04/2026',
  },
  {
    id: 6,
    type: 'audio',
    title: '5-Minute Scenario Planning Overview',
    description: 'Audio summary of the most likely escalation pathways and their economic impact.',
    date: '11/04/2026',
  },
  {
    id: 4,
    type: 'presentation',
    title: 'Diplomatic Pathways & Red Lines',
    description: 'Visual breakdown of diplomatic off-ramps, escalation triggers, and stakeholder positions.',
    date: '06/04/2026',
  },
  {
    id: 8,
    type: 'audio',
    title: '20-Minute Deep Dive: Scenario Analysis',
    description: 'Extended scenario planning session covering blockade, quarantine, and kinetic action scenarios.',
    date: '28/03/2026',
  },
];

const keyActors = [
  { role: 'China', stake: ' PLA Navy amphibious assault capability; economic coercion toolkit' },
  { role: 'United States', stake: 'Forward-deployed forces; semiconductor supply chain dependency' },
  { role: 'Taiwan', stake: 'Defensive modernization (ASCM, mobile air defence); domestic resilience' },
  { role: 'Japan', stake: 'US alliance obligations; geographic exposure to blockade' },
];

function RiskGauge({ score }: { score: number }) {
  const getColor = (s: number) => {
    if (s >= 85) return '#ef4444';
    if (s >= 65) return '#f59e0b';
    return '#22c55e';
  };
  const color = getColor(score);
  const circumference = 2 * Math.PI * 38;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="strait-gauge">
      <svg viewBox="0 0 88 88" className="strait-gauge-svg">
        <circle cx="44" cy="44" r="38" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
        <circle
          cx="44"
          cy="44"
          r="38"
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 44 44)"
        />
      </svg>
      <span className="strait-gauge-value" style={{ color }}>{score}</span>
      <span className="strait-gauge-label">THREAT INDEX</span>
    </div>
  );
}

function ContentIcon({ type }: { type: string }) {
  switch (type) {
    case 'pdf':
    case 'report':
      return <FileText className="content-icon icon-pdf" />;
    case 'audio':
      return <Headphones className="content-icon icon-audio" />;
    case 'presentation':
      return <Presentation className="content-icon icon-presentation" />;
    default:
      return <FileText className="content-icon icon-pdf" />;
  }
}

function ContentCard({ item }: { item: typeof riskAssessment[number] }) {
  return (
    <a href="#" className="strait-content-card">
      <div className={`strait-content-card__icon strait-content-card__icon--${item.type}`}>
        <ContentIcon type={item.type} />
      </div>
      <div className="strait-content-card__body">
        <div className="strait-content-card__meta">
          <span className={`strait-content-card__badge badge-${item.type}`}>
            {item.type.toUpperCase()}
          </span>
          <span className="strait-content-card__date">{item.date}</span>
        </div>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>
      <div className="strait-content-card__action">
        {item.type === 'pdf' || item.type === 'report' ? (
          <span className="strait-content-card__cta">Download <ArrowUpRight className="cta-arrow" /></span>
        ) : (
          <span className="strait-content-card__cta cta-play"><Play className="cta-icon" />Play</span>
        )}
      </div>
    </a>
  );
}

export default function TaiwanStraitPage() {
  return (
    <div className="container">
      <div className="strait-page">

        <Link to="/dashboard" className="strait-back-link">
          <ArrowLeft className="strait-back-link-icon" /> Back to Dashboard
        </Link>

        <header className="strait-header">
          <div className="strait-header-top">
            <h1>Taiwan Strait</h1>
            <RiskGauge score={REGION_RISK} />
          </div>
          <span className="strait-threat-badge">CRITICAL THREAT LEVEL</span>
          <p className="strait-description">
            Real-time monitoring and analysis of the Taiwan Strait security environment.
            Covering military posturing, diplomatic developments, and economic impacts.
          </p>
        </header>

        <section className="strait-judgement">
          <h2>Core Judgement</h2>
          <p>
            The Taiwan Strait is the single highest-consequence fracture point in the global system.
            A successful Chinese blockade or kinetic action against Taiwan would generate an estimated
            $10 trillion in first-year global economic damage, collapse the semiconductor supply chain
            that underpins every advanced economy, and force the most consequential US strategic decision
            since 1962. The question is not whether this fracture is possible &mdash; it is whether the
            international community has built the decision architecture to manage it before it becomes irreversible.
          </p>
        </section>

        <section className="strait-actors-section">
          <div className="strait-actors-header">
            <Users className="strait-actors-icon" />
            <h2>Key Actors</h2>
          </div>
          <div className="strait-actors-grid">
            {keyActors.map(actor => (
              <div key={actor.role} className="strait-actor-card">
                <h3>{actor.role}</h3>
                <p>Strategic stake: {actor.stake}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="strait-content-section">
          <div className="strait-content-section-header">
            <h2>Risk Assessment</h2>
            <a href="#" className="strait-content-view-all">View all <ArrowUpRight className="strait-content-view-icon" /></a>
          </div>
          <div className="strait-content-grid">
            {riskAssessment.map(item => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        <section className="strait-content-section">
          <div className="strait-content-section-header">
            <h2>Scenario Planning</h2>
            <a href="#" className="strait-content-view-all">View all <ArrowUpRight className="strait-content-view-icon" /></a>
          </div>
          <div className="strait-content-grid">
            {scenarioPlanning.map(item => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
