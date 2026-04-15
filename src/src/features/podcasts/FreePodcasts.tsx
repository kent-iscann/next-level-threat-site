import './FreePodcasts.css';

export default function FreePodcasts() {
  return (
    <section id="podcasts" className="podcasts section">
      <div className="container">
        <div className="podcasts__header">
          <h2 className="section-title">Open-Source Intelligence</h2>
          <p className="section-subtitle">Dive into our open-access conversations, historical investigations, and summary briefings.</p>
        </div>

        <div className="podcasts__grid">
          <div className="podcast-card">
            <h3 className="podcast-card__title">COLD CASE</h3>
            <p className="podcast-card__desc">Examines the gaps between the official narrative and public record of historical government scandals.</p>
            <div className="podcast-card__embed">
              <iframe data-testid="embed-iframe" style={{borderRadius:'12px'}} src="https://open.spotify.com/embed/episode/7KY1Yi9mYeTjMsPdx3WzZx?utm_source=generator" width="100%" height="152" frameBorder="0" allowFullScreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
            </div>
          </div>

          <div className="podcast-card">
            <h3 className="podcast-card__title">In Conversation</h3>
            <p className="podcast-card__desc">Features IScann Group's panel of experts discussing important geopolitical topics.</p>
            <div className="podcast-card__embed">
              <iframe data-testid="embed-iframe" style={{borderRadius:'12px'}} src="https://open.spotify.com/embed/episode/4IYTVQwlnw1vaJEDEwzN9o?utm_source=generator" width="100%" height="152" frameBorder="0" allowFullScreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
            </div>
          </div>
        </div>

        <div className="newsletter__inner">
          <div className="podcast-card">
            <h3 className="podcast-card__title">The Weekly Briefing</h3>
            <p className="podcast-card__desc">
              A concise summary of the week's most significant geopolitical developments — delivered to your inbox every Monday. Free.
            </p>
            <form
            className="newsletter__form"
            onSubmit={(e) => {
              e.preventDefault();
              // Placeholder — wire up email provider at launch
              alert('Thanks — placeholder signup. Real integration coming soon.');
            }}
          >
            <input
              type="email"
              placeholder="your@email.com"
              required
              className="newsletter__input"
              aria-label="Email address"
            />
            <button type="submit" className="btn btn-primary newsletter__btn">
              Subscribe
            </button>
          </form>
          <p className="newsletter__note">
            One email per week. No spam. Unsubscribe anytime.
          </p>
          </div>
        </div>
      </div>
    </section>
  );
}