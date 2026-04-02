import './FreePodcasts.css';

export default function FreePodcasts() {
  return (
    <section id="podcasts" className="podcasts section">
      <div className="container">
        <div className="podcasts__header">
          <h2 className="section-title">Free Podcast Intelligence</h2>
          <p className="section-subtitle">Dive into our open-access conversations and historical investigations.</p>
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
            <h3 className="podcast-card__title">IScann in Conversation</h3>
            <p className="podcast-card__desc">Features IScann Group's panel of experts discussing important geopolitical topics.</p>
            <div className="podcast-card__embed">
              <iframe data-testid="embed-iframe" style={{borderRadius:'12px'}} src="https://open.spotify.com/embed/episode/4IYTVQwlnw1vaJEDEwzN9o?utm_source=generator" width="100%" height="152" frameBorder="0" allowFullScreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}