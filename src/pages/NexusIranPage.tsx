import './NexusIranPage.css';
import { ArrowLeft, FileText, Presentation, Headphones, ArrowUpRight, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const riskAssessment = [
  {
    id: 1,
    type: 'audio',
    title: 'Persia',
    description: 'Before the Republic, before Islam\'s arrival, before the foreign powers — there was Persia.',
    date: '12/04/2026',
    source: 'Nexus - Iran - Episode 1.mp3'
  },
  {
    id: 2,
    type: 'audio',
    title: 'Oil',
    description: 'The resource that made Iran a target.',
    date: '13/04/2026',
  },
  {
    id: 3,
    type: 'audio',
    title: 'Empire',
    description: 'Britain first, then America. How great powers managed Iran as an asset rather than a nation.',
    date: '08/04/2026',
  },
  {
    id: 4,
    type: 'audio',
    title: 'Nationalism',
    description: 'Extended analysis of military exercises, economic leverage points, and US force posture.',
    date: '30/03/2026',
  },
  {
    id: 5,
    type: 'audio',
    title: 'Revolution',
    description: 'Comprehensive analysis of PLA amphibious readiness drills and semiconductor supply chain risk.',
    date: '12/04/2026',
  },
  {
    id: 6,
    type: 'audio',
    title: 'Martyrdom',
    description: 'Quick briefing on the current threat posture and key indicators to watch.',
    date: '13/04/2026',
  },
  {
    id: 7,
    type: 'audio',
    title: 'The Enemy',
    description: 'Summary of recent diplomatic movements and their implications for regional stability.',
    date: '08/04/2026',
  },
  {
    id: 8,
    type: 'audio',
    title: 'Sanctions',
    description: 'Extended analysis of military exercises, economic leverage points, and US force posture.',
    date: '30/03/2026',
  },
  {
    id: 9,
    type: 'audio',
    title: 'The Arm',
    description: 'Comprehensive analysis of PLA amphibious readiness drills and semiconductor supply chain risk.',
    date: '12/04/2026',
  },
  {
    id: 10,
    type: 'audio',
    title: 'The Bomb',
    description: 'Quick briefing on the current threat posture and key indicators to watch.',
    date: '13/04/2026',
  },
  {
    id: 11,
    type: 'audio',
    title: 'The Street',
    description: 'Summary of recent diplomatic movements and their implications for regional stability.',
    date: '08/04/2026',
  },
  {
    id: 12,
    type: 'audio',
    title: 'The Bargain',
    description: 'Extended analysis of military exercises, economic leverage points, and US force posture.',
    date: '30/03/2026',
  },
];

const futureOutlook = [
  {
    id: 1,
    type: 'report',
    title: '12-Month Projection (Q2 2026 - Q1 2027)',
    description: 'What to expect over the next 12 months based on current indicators and historical patterns.',
    date: '12/04/2026',
    source: 'Nexus - Iran - Future.pdf'
  },
]

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
        <h3>{item.title}</h3>
        <p>{item.description}</p>
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
          <span className="strait-brand-label">NEXUS</span>
          <div className="strait-header-top">
            <h1>Islamic Republic of Iran</h1>
          </div>
          <p className="strait-description">
            Analysing the characteristics that make Iran an enduring and difficult adversary.
          </p>
        </header>

        <section className="strait-judgement">
          <h2><Target className="strait-h2-icon" /> Core Assessment</h2>
          <p>
            The Islamic Republic of Iran remains underestimated by the United States, Israel, and its other adversaries. This is not the Ottoman or Persian empire of the early 20th century. This is a hardened regime strengthened by 40+ years of life under sanctions and war. Nuclear weapons capabilities or not, there should be no expectation that the regime will fall or that the recent war created the conditions for revolution. If anything, the opposite should be assumed. The IRGC remains the dominant force in the country and its power has only increased as a result of the recent strikes.
          </p>
        </section>

        <section className="strait-content-section">
          <div className="strait-content-section-header">
            <h2>Historical Excavation</h2>
          </div>
          <div className="strait-content-grid">
            {riskAssessment.map(item => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        <section className="strait-content-section">
          <div className="strait-content-section-header">
            <h2>Future Outlook</h2>
          </div>
          <div className="strait-content-grid">
            {futureOutlook.map(item => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
