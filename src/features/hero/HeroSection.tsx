import './HeroSection.css';
import { Signup } from '../../components/Signup';

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="container hero__content">
        <div className="hero__badge">Powered by IScann Group</div>
        <h1 className="hero__title">
          Your Chief<br />
          <span className="accent">Geopolitical Officer</span>
        </h1>
        <p className="hero__subtitle">
          Signal & Fracture identifies instability before it becomes crisis.
        </p>
        <div className="hero__actions">
          <Signup />
        </div>
      </div>
      <div className="hero__bg"></div>
    </section>
  );
}