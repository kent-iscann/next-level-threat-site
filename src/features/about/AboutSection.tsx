import './AboutSection.css';

export default function AboutSection() {
  return (
    <section id="about" className="about section">
      <div className="container">
        <div className="about__content">
          <h2 className="section-title">Our Philosophy</h2>
          <p className="about__text">
            We believe that understanding the global landscape requires more than just reading headlines. It demands rigorous historical excavation, meticulous open-source verification, and the application of advanced analytical frameworks. Knowledge should not just inform—it should prepare.
          </p>
          <p className="about__text">
            Next Level Threat bridges the gap between scattered open-source intelligence and strategic foresight, empowering individuals and organizations to navigate an increasingly volatile world with clarity and confidence.
          </p>
          <div className="about__footer">
            <p className="about__group">A flagship intelligence solution by <a href="https://iscanngroup.com" target="_blank" className="about__brand">IScann Group</a></p>
          </div>
        </div>
      </div>
    </section>
  );
}