import './DashboardPage.css';
import { ArrowLeft, AlertTriangle, ExternalLink, FileText, Radio, Calendar, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const criticalRegions = [
  { id: 'taiwan-strait', name: 'Taiwan Strait', threatLevel: 'critical', path: '/taiwan-strait' },
  { id: 'sahel', name: 'Sahel', threatLevel: 'critical', path: '/sahel' },
  { id: 'black-sea', name: 'Black Sea', threatLevel: 'critical', path: '/black-sea' },
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
      { label: 'Iran', date: '', path: '#' },
      { label: 'Venezuela', date: '', path: '#' },
      { label: 'Taiwan', date: '', path: '#' },
    ],
  },
  {
    icon: Calendar,
    title: 'Weekly Briefings',
    description: 'Summarized key developments from the past week',
    items: [
      { label: 'Week #14', date: '', path: '#' },
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

export default function DashboardPage() {
  return (
    <div className="container">
      <div className="dashboard-page">

        <Link to="/" className="dash-back-link">
          <ArrowLeft className="dash-back-link-icon" /> Back to Home
        </Link>

        <header className="dash-header">
          <h1>Intelligence Dashboard</h1>
          <p>Access content verticals and monitor critical threat regions</p>
        </header>

        <section className="dash-regions-section">
          <div className="dash-regions-header">
            <AlertTriangle className="dash-regions-icon" />
            <h2>Critical Threat Regions</h2>
          </div>
          <p className="dash-regions-subtitle">
            Active fracture points requiring continuous monitoring and real-time intelligence.
          </p>
          <div className="dash-regions-grid">
            {criticalRegions.map(region => (
              <div key={region.id} className={`region-card ${region.threatLevel}`}>
                <div className="region-card__pulse" />
                <div className="region-card__content">
                  <div className="region-card__status">
                    <span className="region-card__dot" />
                    <span className="region-card__label">ACTIVE THREAT</span>
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

        <section className="dash-verticals-section">
          <h2>Recent Intelligence</h2>
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
                        <a href={item.path} className="dash-vertical-card__item-link">
                          <span className="dash-vertical-card__item-label">{item.label}</span>
                          {item.date && <span className="dash-vertical-card__item-date">{item.date}</span>}
                        </a>
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
