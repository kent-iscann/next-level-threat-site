import './HeroSection.css';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="container hero__content">
        <div className="hero__badge">Powered by IScann Group</div>
        <h1 className="hero__title">
          Your Chief<br />
          <span className="accent">Geopolitical Officer.</span>
        </h1>
        <p className="hero__subtitle">
          Next Level Threat decodes today's complexities and anticipates tomorrow's critical threats so you can act before risk becomes crisis.
        </p>
        <div className="hero__actions">
          <Link to="/dashboard" className="btn btn-primary">View Demo</Link>
          <a href="#podcasts" className="btn btn-secondary">Explore Free Intel</a>
        </div>
      </div>
      <div className="hero__bg"></div>
    </section>
  );
}