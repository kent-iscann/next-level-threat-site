import './Footer.css';

export default function Footer() {
  const navLinks = [
    { label: 'Signal & Fracture', href: '#plus' },
    { label: 'Nexus', href: '#nexus' },
    { label: 'Open-Source Intelligence', href: '#podcasts' },
    { label: 'About', href: '#about' },
  ];

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__top">
            <img width="48px" src="images/nlt_logo.png" alt="Next Level Threat Logo" />
            <h3 className="footer__title">Next Level Threat</h3>
          <p className="footer__tagline">Your Chief Geopolitical Officer</p>
          <a href="#plus" className="btn btn-primary footer__cta">View Demo</a>
        </div>
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