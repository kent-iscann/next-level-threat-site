import './SignalFracture.css';
import { ArrowLeft, FileText, Presentation, Headphones, ArrowUpRight, Users, Target, MapPin, Newspaper } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';




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

function ContentCard({ item }: { item: any }) {
  return (
    <div className="strait-content-card">
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
      </div>
      <div className="strait-content-card__action">
        {item.type === 'presentation' || item.type === 'report' ? (
          <a href={item.source} className="strait-content-card__cta" target="_blank" rel="noopener noreferrer">
            Read <ArrowUpRight className="cta-arrow" />
          </a>
        ) : (
          <span className="strait-content-card__cta cta-play">
            <audio controls>
              <source src={item.source} type="audio/mpeg" />
              Your browser does not support the audio tag.
            </audio>
          </span>
        )}
      </div>
    </div>
  );
}

export default function SignalFractureSlugPage() {
  const { slug } = useParams();

  const jsonModules = import.meta.glob('/src/content/signal-fracture/*.json', { eager: true });

  const jsonKey = `/src/content/signal-fracture/${slug}.json`;
     const jsonModule = jsonModules[jsonKey];

     if (!jsonModule) {
       return <div>Data not found for {slug}</div>;
     }

    const data = (jsonModule as any).default;


    return (
      <div className="container">
        <div className="strait-page">

          <Link to="/dashboard" className="strait-back-link">
            <ArrowLeft className="strait-back-link-icon" /> Back to Dashboard
          </Link>

          <header className="strait-header">
            <span className="strait-brand-label">SIGNAL &amp; FRACTURE</span>
            <div className="strait-header-top">
              <h1>{ data.title }</h1>
              <span className="strait-threat-badge">{ data.threat_level }</span>
              <RiskGauge score={ data.scores.composite_risk} />
            </div>
            <p className="strait-description">
              { data.subtitle }
            </p>
          </header>

          <section className="strait-judgement">
            <h2><Target className="strait-h2-icon" /> Core Assessment</h2>
            <p>
              { data.core_assessment }
            </p>
          </section>

          <section className="strait-actors-section">
            <div className="strait-subheader">
              <Users className="strait-icon" />
              <h2>Key Actors</h2>
            </div>
            <div className="strait-actors-grid">
              {data.key_actors.map((actor: any) => (
                <div key={actor.id} className="strait-actor-card">
                  <h3>{actor.name}</h3>
                  <p><strong>Strategic stake:</strong> {actor.stake}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="strait-content-section">
            <div className="strait-subheader">
              <Newspaper className="strait-icon" />
              <h2>Risk Assessment</h2>
              {/* <a href="#" className="strait-content-view-all">View all <ArrowUpRight className="strait-content-view-icon" /></a> */}
            </div>
            <div className="strait-content-grid">
              {data.risk_content.map((item: any) => (
                <ContentCard key={item.id} item={item} />
              ))}
            </div>
          </section>

          <section className="strait-content-section">
            <div className="strait-subheader">
              <MapPin className="strait-icon" />
              <h2>Scenario Planning</h2>
              {/* <a href="#" className="strait-content-view-all">View all <ArrowUpRight className="strait-content-view-icon" /></a> */}
            </div>
            <div className="strait-content-grid">
              {data.scenario_content.map((item: any) => (
                <ContentCard key={item.id} item={item} />
              ))}
            </div>
          </section>

        </div>
      </div>
    );
}
