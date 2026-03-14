import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import './Footer.css';

export default function Footer() {
  const { profile } = usePortfolio();
  const year = new Date().getFullYear();

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-bracket">&lt;</span>
              {profile.name.split(' ').map((n) => n[0]).join('')}
              <span className="logo-bracket">/&gt;</span>
            </div>
            <p className="footer-tagline">
              Building digital products, brands, and experiences.
            </p>
          </div>

          <div className="footer-nav">
            <h4>Quick Links</h4>
            <ul>
              {['home', 'about', 'skills', 'projects', 'contact'].map((id) => (
                <li key={id}>
                  <button onClick={() => scrollTo(id)}>
                    {id.charAt(0).toUpperCase() + id.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-contact">
            <h4>Contact</h4>
            <p><a href={`mailto:${profile.email}`}>{profile.email}</a></p>
            <p>{profile.location}</p>
            <div className="footer-socials">
              <a href={profile.twitter} target="_blank" rel="noreferrer"><i className="fa fa-twitter"></i></a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer"><i className="fa fa-linkedin"></i></a>
              {profile.github && profile.github !== '#' && (
                <a href={profile.github} target="_blank" rel="noreferrer"><i className="fa fa-github"></i></a>
              )}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {year} <span>{profile.name}</span>. All rights reserved.
          </p>
          <p className="footer-admin-link">
            <a href="/admin">Admin Panel</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
