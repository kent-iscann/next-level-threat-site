import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { UserCircle } from 'lucide-react';
import './Header.css';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const cleanPath = pathname.replace(/\/+$/, '');
  const isDemoPage =
    cleanPath.startsWith('/dashboard') ||
    cleanPath.startsWith('/signal-fracture') ||
    cleanPath.startsWith('/nexus') ||
    cleanPath.startsWith('/archive');

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
            <Link to="/"><img src="/images/sf-logo.png" alt="Signal & Fracture Logo" /></Link>
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
    { label: 'Free Intelligence', href: '#nexus' },
    { label: 'Signal & Fracture Pro', href: '#plus' },
    { label: 'About', href: '#about' },
  ];

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
      <div className="container header__inner">
          <div className="logo">
            <Link to="/"><img src="/images/sf-logo.png" alt="Signal & Fracture Logo" /></Link>
            <span>Signal &<br />Fracture</span>
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
          <Link to="#subscribe" className="btn btn-primary nav__cta" onClick={() => setIsMenuOpen(false)}>Subscribe</Link>
        </nav>
      </div>
    </header>
  );
}