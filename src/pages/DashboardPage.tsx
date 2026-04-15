import './DashboardPage.css';

const signalFractureItems = [
  { id: 1, title: 'Report: Regional Escalation Trends', type: 'pdf', date: '2026-04-10' },
  { id: 2, title: 'Report: Economic Pressure Indicators', type: 'pdf', date: '2026-04-08' },
  { id: 3, title: 'Presentation: Intelligence Overview Q2', type: 'presentation', date: '2026-04-05' },
  { id: 4, title: 'Presentation: Strategic Forecasting', type: 'presentation', date: '2026-04-03' },
  { id: 5, title: 'Audio: 5-Min Risk Assessment Overview', type: 'audio-5min', date: '2026-04-12' },
  { id: 6, title: 'Audio: 5-Min Scenario Planning Overview', type: 'audio-5min', date: '2026-04-11' },
  { id: 7, title: 'Deep Dive: 20-Min Risk Assessment Analysis', type: 'audio-20min', date: '2026-03-28' },
  { id: 8, title: 'Deep Dive: 20-Min Scenario Planning Analysis', type: 'audio-20min', date: '2026-03-27' },
];

export default function DashboardPage() {
  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Chief Geopolitical Officer Dashboard</h1>
        <p>Access our content verticals and critical threat regions</p>
      </div>

      <section className="verticals-section">
        <h2>Content Verticals</h2>
        <div className="cards-grid">
          <div className="card">
            <h3>Signal & Fracture</h3>
            <p>Primary intelligence stream with in-depth reports and analysis</p>
            <a href="/taiwan-strait" className="btn-link">Explore →</a>
          </div>
          <div className="card">
            <h3>Nexus</h3>
            <p>Cross-domain connections and systemic risk mapping</p>
            <button>Coming Soon</button>
          </div>
          <div className="card">
            <h3>Weekly Briefings</h3>
            <p>Summarized key developments from the past week</p>
            <button>Upcoming Briefing</button>
          </div>
          <div className="card">
            <h3>Quarterly Updates</h3>
            <p>Comprehensive strategic reviews each quarter</p>
            <button>Q3 Update Scheduled</button>
          </div>
        </div>
      </section>

      <section className="critical-regions-section">
        <h2>Critical Threat Regions</h2>
        <div className="regions-list">
          <span className="region-tag critical">Taiwan Strait</span>
          <span className="region-tag critical">Sahel</span>
          <span className="region-tag critical">Black Sea</span>
        </div>
      </section>

      <section className="signal-fracture-section">
        <h2>Signal & Fracture — Recent Content</h2>
        <div className="content-list">
          {signalFractureItems.map(item => (
            <div key={item.id} className="content-item">
              <div className="item-meta">
                <span className="type-badge">{item.type.replace('-', ' ').toUpperCase()}</span>
                <span className="date">{item.date}</span>
              </div>
              <h4>{item.title}</h4>
              <button>Access</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}