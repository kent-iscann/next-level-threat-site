import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { UserCircle } from 'lucide-react';
import './Header.css';

// Paths where the header should be simplified (no nav menu, no CTA)
const DEMO_PAGES = ['/dashboard', '/taiwan-strait', '/nexus-iran'];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isDemoPage = DEMO_PAGES.includes(location.pathname);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simplified header for demo pages — no nav menu, no CTA
  if (isDemoPage) {
    return (
      <header className={`header ${isScrolled ? 'header--scrolled' : ''} header--demo`}>
        <div className="container header__inner" style={{ justifyContent: 'space-between' }}>
          <div className="logo">
            <Link to="/"><img src="images/nlt_logo.png" alt="Next Level Threat Logo" /></Link>
          </div>
          <div className="header__demo-right">
            <UserCircle className="header__avatar-icon" />
            <span className="header__greeting">Welcome, Demo User</span>
          </div>
        </div>
      </header>
    );
  }

  const navLinks = [
    { label: 'Signal & Fracture', href: '#plus' },
    { label: 'Nexus', href: '#plus' },
    { label: 'Open-Source Intelligence', href: '#podcasts' },
    { label: 'About', href: '#about' },
  ];

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
      <div className="container header__inner">
          <div className="logo">
            <Link to="/"><img src="images/nlt_logo.png" alt="Next Level Threat Logo" /></Link>
          </div>

        <button className="header__toggle" aria-label="Toggle menu" aria-expanded={isMenuOpen} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span className={`bar ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`bar ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`bar ${isMenuOpen ? 'open' : ''}`}></span>
        </button>

        <nav className={`nav ${isMenuOpen ? 'nav--open' : ''}`}>
          <ul className="nav__list">
            {navLinks.map(link => (
              <li key={link.label}>
                <a href={link.href} className="nav__link" onClick={() => setIsMenuOpen(false)}>{link.label}</a>
              </li>
            ))}
          </ul>
          <Link to="/dashboard" className="btn btn-primary nav__cta" onClick={() => setIsMenuOpen(false)}>View Demo</Link>
        </nav>
      </div>
    </header>
  );
}