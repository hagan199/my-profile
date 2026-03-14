import React from 'react';
import Typical from 'react-typical';
import { usePortfolio } from '../../context/PortfolioContext';
import meImg from '../../assets/Home/me.jpg';
import './Hero.css';

export default function Hero() {
  const { profile } = usePortfolio();
  const profileImg = profile.profileImage || meImg;
  const typicalSteps = profile.roles.flatMap((role) => [role, 1500]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="hero-section">
      <div className="hero-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>

      <div className="hero-content">
        <div className="hero-text">
          <div className="hero-social">
            {profile.facebook && profile.facebook !== '#' && (
              <a href={profile.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                <i className="fa fa-facebook"></i>
              </a>
            )}
            <a href={profile.twitter} target="_blank" rel="noreferrer" aria-label="Twitter">
              <i className="fa fa-twitter"></i>
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <i className="fa fa-linkedin"></i>
            </a>
            {profile.github && profile.github !== '#' && (
              <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                <i className="fa fa-github"></i>
              </a>
            )}
          </div>

          <p className="hero-greeting">Hello, I'm</p>
          <h1 className="hero-name">
            {profile.name.split(' ')[0]}{' '}
            <span className="name-highlight">{profile.name.split(' ').slice(1).join(' ')}</span>
          </h1>

          <div className="hero-role">
            <Typical loop={Infinity} steps={typicalSteps} wrapper="span" />
          </div>

          <p className="hero-bio">{profile.bio}</p>

          <div className="hero-buttons">
            <button
              className="btn primary-btn"
              onClick={() => scrollTo('contact')}
            >
              Hire Me
            </button>
            <a href={profile.cvFile} download>
              <button className="btn highlighted-btn">Get Resume</button>
            </a>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-value">{profile.experience}</span>
              <span className="stat-label">Years Exp.</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-value">{profile.projectsCount}</span>
              <span className="stat-label">Projects</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-value">{profile.clientsCount}</span>
              <span className="stat-label">Clients</span>
            </div>
          </div>
        </div>

        <div className="hero-image">
          <div className="hero-img-glow"></div>
          <div className="hero-img-wrapper">
            <img src={profileImg} alt={profile.name} />
          </div>
        </div>
      </div>

      <div className="hero-scroll-hint" onClick={() => scrollTo('about')}>
        <span>Scroll Down</span>
        <div className="scroll-arrow">
          <i className="fa fa-chevron-down"></i>
        </div>
      </div>
    </section>
  );
}
