import './HeroSection.css';

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="container hero__content">
        <div className="hero__badge">Powered by IScann Group</div>
        <h1 className="hero__title">
          Navigate the Shadows<br />
          <span className="accent">of Tomorrow.</span>
        </h1>
        <p className="hero__subtitle">
          AI-enhanced geopolitical intelligence that decodes today's complexities and anticipates tomorrow's critical threats.
        </p>
        <div className="hero__actions">
          <a href="#plus" className="btn btn-primary">Subscribe to Threat+</a>
          <a href="#podcasts" className="btn btn-secondary">Explore Free Podcasts</a>
        </div>
      </div>
      <div className="hero__bg"></div>
    </section>
  );
}