import './DashboardPage.css';

export default function DashboardPage() {
  return (
    <div className="container">
      <div className="dashboard-page">
        <div className="dashboard-header">
          <h1>Next Level Threat Dashboard</h1>
          <p>Access our content verticals and critical threat regions</p>
        </div>

        <section className="critical-regions-section">
          <h2>Critical Threat Regions</h2>
          <div className="regions-list">
            <a href="/taiwan-strait" className="region-tag critical"><span>Taiwan Strait</span></a>
            <span className="region-tag critical">Sahel</span>
            <span className="region-tag critical">Black Sea</span>
          </div>
        </section>

        <section className="verticals-section">
          <h2>Recent Intelligence</h2>
          <div className="dashboard__grid">
            <div className="dashboard-card">
              <h3 className="dashboard-card__title">Signal & Fracture</h3>
              <p>Primary intelligence stream with in-depth reports and analysis</p>
              <ul>
                <li><a href="/taiwan-strait">Taiwan Strait - 15/04/2026</a></li>
                <li><a href="#">Sahel - 01/04/2026</a></li>
                <li><a href="#">Black Sea - 16/03/2026</a></li>
              </ul>
            </div>
            <div className="dashboard-card">
              <h3 className="dashboard-card__title">Nexus</h3>
              <p>Cross-domain connections and systemic risk mapping</p>
              <ul>
                <li><a href="#">Iran</a></li>
                <li><a href="#">Venezuela</a></li>
                <li><a href="#">Taiwan</a></li>
              </ul>
            </div>
            <div className="dashboard-card">
              <h3 className="dashboard-card__title">Weekly Briefings</h3>
              <p>Summarized key developments from the past week</p>
              <ul>
                <li><a href="#">Week #14</a></li>
                <li><a href="#">Week #13</a></li>
                <li><a href="#">Week #12</a></li>
              </ul>
            </div>
            <div className="dashboard-card">
              <h3 className="dashboard-card__title">Quarterly Updates</h3>
              <p>Comprehensive strategic reviews each quarter</p>
              <ul>
                <li><a href="#">Q1 2026</a></li>
                <li><a href="#">Q4 2025</a></li>
                <li><a href="#">Q3 2025</a></li>
              </ul>
            </div>
          </div>
        </section>

        

      </div>
    </div>
  );
}