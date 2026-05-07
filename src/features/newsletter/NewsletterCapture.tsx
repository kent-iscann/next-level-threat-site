import './NewsletterCapture.css';

export default function NewsletterCapture() {
  return (
    <section id="newsletter" className="newsletter section">
      <div className="container">
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
