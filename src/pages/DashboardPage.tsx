import './DashboardPage.css';
import { AlertTriangle, ExternalLink, FileText, Radio, Calendar, Globe, ArrowUpRight, Newspaper, Archive } from 'lucide-react';
import { Link } from 'react-router-dom';

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

  const regionModules = import.meta.glob('/src/content/regions/*.json', {eager: true });
  
  const regions = Object.entries(regionModules)
    .map(([key, module]) => {
      const json = (module as any).default;
      if (json.threat_level !== 'CRITICAL') return null;

      const slug = key.split('/').pop()?.replace('.json', '') ?? '';
      return {
        id: slug,
        name: json.title || slug,
        threatLevel: json.threat_level.toLowerCase(),
        path: json.uid ? `/${json.uid}` : `/${slug}`,
        riskScore: json.risk_score ?? 0,
        uid: json.uid || `/${slug}`,
      };
    })
    .filter((region): region is NonNullable<typeof region> => region !== null)
    .sort((a, b) => b.riskScore - a.riskScore);

  // Load all JSON files from the content directories
  const signalFractureModules = import.meta.glob('/src/content/signal-fracture/*.json', { eager: true });
  const nexusModules = import.meta.glob('/src/content/nexus/*.json', { eager: true });

  const getActivityItems = (modules: any, sourceName: string, iconComponent: any) => {
    return Object.entries(modules).map(([key, module]) => {
      const json = (module as any).default;
      const pathParts = key.split('/');
      const fileName = pathParts[pathParts.length - 1];
      const slug = fileName.replace('.json', '');
      
      return {
        icon: iconComponent,
        title: json.title || '',
        description: json.subtitle || '',
        date: json.publish_date,
        path: `/${sourceName.toLowerCase().replace(' & ', '-')}/${slug}`,
        source: json.source || sourceName // Use JSON source if available, else fallback to directory name
      };
    });
  };

  const signalFractureItems = getActivityItems(signalFractureModules, 'Signal & Fracture', FileText);
  const nexusItems = getActivityItems(nexusModules, 'Nexus', Globe);

  const allItems = [...signalFractureItems, ...nexusItems];
  const sortedItems = allItems.sort((a, b) => {
    const dateA = a.date.split('/').reverse().join('-');
    const dateB = b.date.split('/').reverse().join('-');
    return new Date(dateB).getTime() - new Date(dateA).getTime(); // Descending
  });
  const latestActivity = sortedItems.slice(0, 2);

  const verticals = [
    {
      icon: FileText,
      title: 'Signal & Fracture',
      description: 'Primary intelligence stream with in-depth reports and analysis',
      items: signalFractureItems
        .map(item => ({ label: item.title, date: item.date, path: item.path }))
        .sort((a, b) => new Date(b.date.split('/').reverse().join('-')).getTime() - new Date(a.date.split('/').reverse().join('-')).getTime())
        .slice(0, 5),
    },
    {
      icon: Globe,
      title: 'Nexus',
      description: 'Cross-domain connections and systemic risk mapping',
      items: nexusItems
        .map(item => ({ label: item.title, date: item.date, path: item.path }))
        .sort((a, b) => new Date(b.date.split('/').reverse().join('-')).getTime() - new Date(a.date.split('/').reverse().join('-')).getTime())
        .slice(0, 5),
    },
    {
      icon: Calendar,
      title: 'Briefings',
      description: 'Summarized key developments from the past week',
      items: [
        { label: 'Taiwan Strait', date: '17/04/2026', path: '#' },
        { label: 'Sahel', date: '10/04/2026', path: '#' },
        { label: 'Black Sea', date: '03/04/2026', path: '#' },
      ],
    },
    {
      icon: Radio,
      title: 'Quarterly Updates',
      description: 'Comprehensive strategic reviews each quarter',
      items: [
        { label: 'Q1 2026', date: '31/03/2026', path: '#' },
        { label: 'Q4 2025', date: '31/12/2025', path: '#' },
        { label: 'Q3 2025', date: '30/09/2025', path: '#' },
      ],
    },
  ];

  return (
    <div className="container">
      <div className="dashboard-page">

        {/* <Link to="/" className="dash-back-link">
          <ArrowLeft className="dash-back-link-icon" /> Back to Home
        </Link> */}

        <header className="dash-header">
          <h1>Next Level Threat Dashboard</h1>
        </header>

        <section className="dash-regions-section">
          <div className="dash-regions-header">
            <AlertTriangle className="dash-regions-icon" />
            <h2>Critical Threat Regions</h2>
          </div>
          <div className="dash-regions-grid">
            {regions.map(region => (
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
                  {region.uid && region.uid !== '#' ? (
                    <Link to={region.uid} className="region-card__link">
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
            <Newspaper className="dash-latest-header-icon" />
            <h2>Latest Intel</h2>
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
          <div className="dash-verticals-header">
            <h2><Archive className="dash-verticals-h2-icon" /> Archive</h2>
            <Link to="/archive" className="dash-archive-view-all">
              View all <ArrowUpRight className="dash-latest-arrow" />
            </Link>
          </div>
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
