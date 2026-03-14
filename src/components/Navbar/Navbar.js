import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import './Navbar.css';

const navLinks = ['Home', 'About', 'Skills', 'Projects', 'Contact'];

export default function Navbar() {
  const { profile } = usePortfolio();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const sections = navLinks.map((l) => l.toLowerCase());
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="navbar-logo" onClick={() => scrollTo('home')}>
        <span className="logo-bracket">&lt;</span>
        <span className="logo-name">{profile.name.split(' ').map((n) => n[0]).join('')}</span>
        <span className="logo-bracket">/&gt;</span>
      </div>

      <ul className={`navbar-links${menuOpen ? ' open' : ''}`}>
        {navLinks.map((link) => (
          <li key={link}>
            <button
              className={activeSection === link.toLowerCase() ? 'active' : ''}
              onClick={() => scrollTo(link)}
            >
              {link}
            </button>
          </li>
        ))}
        <li>
          <a href="/admin" className="nav-admin-link">
            <i className="fa fa-cog"></i> Admin
          </a>
        </li>
      </ul>

      <button
        className={`hamburger${menuOpen ? ' open' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </nav>
  );
}
