import './HeroSection.css';

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
          AI-enhanced geopolitical intelligence that decodes today's complexities and anticipates tomorrow's critical threats.
        </p>
        <div className="hero__actions">
          <a href="#plus" className="btn btn-primary">View Demo</a>
          <a href="#podcasts" className="btn btn-secondary">Explore Free Intelligence</a>
        </div>
      </div>
      <div className="hero__bg"></div>
    </section>
  );
}