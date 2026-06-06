import { useLocation } from 'react-router-dom';
import { Signup } from '../components/Signup';
import './Footer.css';

export default function Footer() {
  const { pathname } = useLocation();
  const cleanPath = pathname.replace(/\/+$/, '');
  const isDemoPage =
    // cleanPath.startsWith('/dashboard') ||
    // cleanPath.startsWith('/signal-fracture') ||
    cleanPath.startsWith('/archive');

  const navLinks = [
    { label: 'Free Subscription', href: '#nexus' },
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
          <div className="newsletter__wrapper">
            <Signup />
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