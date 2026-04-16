import './DashboardPage.css';
import { ArrowLeft, AlertTriangle, ExternalLink, FileText, Radio, Calendar, Globe, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const criticalRegions = [
  { id: 'taiwan-strait', name: 'Taiwan Strait', threatLevel: 'critical', path: '/taiwan-strait', riskScore: 90 },
  { id: 'sahel', name: 'Sahel', threatLevel: 'critical', path: '/sahel', riskScore: 78 },
  { id: 'black-sea', name: 'Black Sea', threatLevel: 'critical', path: '/black-sea', riskScore: 85 },
];

const latestActivity = [
  {
    icon: FileText,
    title: 'Taiwan Strait',
    description: 'Analysis of PLA amphibious readiness drills and their impact on semiconductor supply chain risk assessment.',
    date: '15/04/2026',
    path: '/taiwan-strait',
    source: 'Signal & Fracture',
  },
  {
    icon: Globe,
    title: 'Islamic Republic of Iran',
    description: 'Explaining modern-day Iran through historical excavation.',
    date: '01/04/2026',
    path: '/nexus-iran',
    source: 'Nexus',
  },
];

const verticals = [
  {
    icon: FileText,
    title: 'Signal & Fracture',
    description: 'Primary intelligence stream with in-depth reports and analysis',
    items: [
      { label: 'Taiwan Strait', date: '15/04/2026', path: '/taiwan-strait' },
      { label: 'Sahel', date: '01/04/2026', path: '#' },
      { label: 'Black Sea', date: '16/03/2026', path: '#' },
    ],
  },
  {
    icon: Globe,
    title: 'Nexus',
    description: 'Cross-domain connections and systemic risk mapping',
    items: [
      { label: 'Islamic Republic of Iran', date: '01/04/2026', path: '/nexus-iran' },
      { label: 'Venezuela', date: '28/03/2026', path: '#' },
      { label: 'Taiwan', date: '14/03/2026', path: '#' },
    ],
  },
  {
    icon: Calendar,
    title: 'Weekly Briefings',
    description: 'Summarized key developments from the past week',
    items: [
      { label: 'Week #14', date: '17/04/2026', path: '#' },
      { label: 'Week #13', date: '', path: '#' },
      { label: 'Week #12', date: '', path: '#' },
    ],
  },
  {
    icon: Radio,
    title: 'Quarterly Updates',
    description: 'Comprehensive strategic reviews each quarter',
    items: [
      { label: 'Q1 2026', date: '', path: '#' },
      { label: 'Q4 2025', date: '', path: '#' },
      { label: 'Q3 2025', date: '', path: '#' },
    ],
  },
];

function RiskGauge({ score }: { score: number }) {
  const getColor = (s: number) => {
    if (s >= 85) return '#ef4444';
    if (s >= 65) return '#f59e0b';
    return '#22c55e';
  };
  const color = getColor(score);
  const circumference = 2 * Math.PI * 18;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="threat-index-gauge">
      <svg viewBox="0 0 44 44" className="threat-index-ring">
        <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
        <circle
          cx="22"
          cy="22"
          r="18"
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 22 22)"
        />
      </svg>
      <span className="threat-index-value" style={{ color }}>{score}</span>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="container">
      <div className="dashboard-page">

        <Link to="/" className="dash-back-link">
          <ArrowLeft className="dash-back-link-icon" /> Back to Home
        </Link>

        <header className="dash-header">
          <h1>Next Level Threat Dashboard</h1>
        </header>

        <section className="dash-regions-section">
          <div className="dash-regions-header">
            <AlertTriangle className="dash-regions-icon" />
            <h2>Threat Regions</h2>
          </div>
          <div className="dash-regions-grid">
            {criticalRegions.map(region => (
              <div key={region.id} className={`region-card ${region.threatLevel}`}>
                <div className="region-card__pulse" />
                <div className="region-card__content">
                  <div className="region-card__status-row">
                    <div className="region-card__status">
                      <span className="region-card__dot" />
                      <span className="region-card__label">ACTIVE THREAT</span>
                    </div>
                    <RiskGauge score={region.riskScore} />
                  </div>
                  <h3 className="region-card__name">{region.name}</h3>
                  {region.path && region.path !== '#' ? (
                    <Link to={region.path} className="region-card__link">
                      Enter Theatre <ExternalLink className="region-card__link-icon" />
                    </Link>
                  ) : (
                    <span className="region-card__coming-soon">Coming Soon</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="dash-latest-section">
          <div className="dash-latest-header">
            <h2>Latest Intelligence</h2>
            {/* <a href="#" className="dash-latest-view-all">View all <ArrowUpRight className="dash-latest-arrow" /></a> */}
          </div>
          <div className="dash-latest-feed">
            {latestActivity.map((item, i) => {
              const Icon = item.icon;
              return (
                <Link key={i} to={item.path} className="dash-latest-card">
                  <div className="dash-latest-card__icon-wrap">
                    <Icon className="dash-latest-card__icon" />
                  </div>
                  <div className="dash-latest-card__body">
                    <div className="dash-latest-card__meta">
                      <span className="dash-latest-card__source">{item.source}</span>
                      <span className="dash-latest-card__date">{item.date}</span>
                    </div>
                    <h3 className="dash-latest-card__title">{item.title}</h3>
                    <p className="dash-latest-card__desc">{item.description}</p>
                  </div>
                  <ArrowUpRight className="dash-latest-card__arrow" />
                </Link>
              );
            })}
          </div>
        </section>

        <section className="dash-verticals-section">
          <h2>Archive</h2>
          <div className="dash-verticals-grid">
            {verticals.map(vertical => {
              const Icon = vertical.icon;
              return (
                <div key={vertical.title} className="dash-vertical-card">
                  <div className="dash-vertical-card__header">
                    <Icon className="dash-vertical-card__icon" />
                    <h3>{vertical.title}</h3>
                  </div>
                  <p className="dash-vertical-card__desc">{vertical.description}</p>
                  <ul className="dash-vertical-card__list">
                    {vertical.items.map((item, i) => (
                      <li key={i} className="dash-vertical-card__item">
                        <Link to={item.path} className="dash-vertical-card__item-link">
                          <span className="dash-vertical-card__item-label">{item.label}</span>
                          {item.date && <span className="dash-vertical-card__item-date">{item.date}</span>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}
