import './NexusPage.css';
import { ArrowLeft, FileText, Presentation, Headphones, ArrowUpRight, Target, Newspaper } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

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

export default function NexusSlugPage() {
  const { slug } = useParams();

  const jsonModules = import.meta.glob('/src/content/nexus/*.json', { eager: true });

  const jsonKey = `/src/content/nexus/${slug}.json`;
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
          <span className="strait-brand-label">NEXUS</span>
          <div className="strait-header-top">
            <h1>{ data.title }</h1>
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

        <section className="strait-content-section">
          <div className="strait-subheader">
            <Newspaper className="strait-icon" />
            <h2>Content</h2>
          </div>
          <div className="strait-content-grid">
            {data.content.map((item: any) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* <section className="strait-content-section">
          <div className="strait-subheader">
            <Binoculars className="strait-icon" />
            <h2>Future Outlook</h2>
          </div>
          <div className="strait-content-grid">
            {data.future_content.map((item: any) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        </section> */}

      </div>
    </div>
  );
}
