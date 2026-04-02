import React, { useState, useEffect } from 'react';
import './Header.css';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Threat+', href: '#plus' },
    { label: 'Free Podcasts', href: '#podcasts' },
    { label: 'About', href: '#about' },
  ];

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
      <div className="container header__inner">
          <div className="logo">
            <img src="images/nlt_logo.png" alt="Next Level Threat Logo" />
          </div>

        <button className="header__toggle" aria-label="Toggle menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
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
          <a href="#plus" className="btn btn-primary nav__cta" onClick={() => setIsMenuOpen(false)}>Subscribe</a>
        </nav>
      </div>
    </header>
  );
}