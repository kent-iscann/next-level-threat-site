import { useLocation, Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const { pathname } = useLocation();
  const cleanPath = pathname.replace(/\/+$/, '');
  const isDemoPage =
    cleanPath.startsWith('/dashboard') ||
    cleanPath.startsWith('/signal-fracture') ||
    cleanPath.startsWith('/nexus');

  const navLinks = [
    { label: 'Free Intelligence', href: '#nexus' },
    { label: 'Signal & Fracture Pro', href: '#plus' },
    { label: 'About', href: '#about' },
  ];

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__top">
          <div className="logo">
            <img src="/images/sf-logo.png" alt="Signal & Fracture Logo" />
            <span>Signal &<br />Fracture</span>
          </div>
          <p className="footer__tagline">Your Chief Geopolitical Officer</p>
        </div>
        {!isDemoPage && 
            <div className="newsletter__inner">
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
          }
        <div className="footer__bottom">
          <nav className="footer__nav">
            {navLinks.map(link => (
              <a key={link.label} href={link.href} className="footer__nav-link">{link.label}</a>
            ))}
          </nav>
          <div className="footer__copyright">&copy; {new Date().getFullYear()} IScann Group. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}