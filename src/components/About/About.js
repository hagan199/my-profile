import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import meImg from '../../assets/Home/me.jpg';
import './About.css';

const highlights = [
  { icon: 'fa-code', label: 'Clean Code', desc: 'Writing maintainable, scalable code is my top priority.' },
  { icon: 'fa-mobile', label: 'Responsive Design', desc: 'Every project is mobile-first and cross-browser compatible.' },
  { icon: 'fa-rocket', label: 'Fast Delivery', desc: 'I work efficiently without compromising on quality.' },
  { icon: 'fa-comments', label: 'Communication', desc: 'Transparent, proactive communication with clients and teams.' },
];

export default function About() {
  const { profile } = usePortfolio();
  const profileImg = profile.profileImage || meImg;

  return (
    <section id="about" className="section about-section">
      <div className="about-container">
        <div className="section-title">
          <h2>About <span>Me</span></h2>
          <p>A little background on who I am and what I do</p>
          <span className="title-line"></span>
        </div>

        <div className="about-content">
          <div className="about-image-side">
            <div className="about-img-frame">
              <img src={profileImg} alt={profile.name} />
              <div className="about-img-badge">
                <span className="badge-value">{profile.experience}</span>
                <span className="badge-label">Years of Experience</span>
              </div>
            </div>
          </div>

          <div className="about-text-side">
            <h3 className="about-subtitle">
              I'm <span>{profile.name}</span>, a Full Stack Developer
            </h3>
            <p className="about-bio">{profile.bio}</p>
            <p className="about-bio">
              I specialize in building complete web applications — from designing intuitive front-end
              interfaces to engineering robust back-end systems. I enjoy every layer of the stack.
            </p>

            <div className="about-info-grid">
              <div className="info-item">
                <span className="info-label">Name:</span>
                <span className="info-value">{profile.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Location:</span>
                <span className="info-value">{profile.location}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email:</span>
                <span className="info-value">{profile.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Available:</span>
                <span className="info-value available">Open to Work</span>
              </div>
            </div>

            <div className="about-actions">
              <a href={profile.cvFile} download>
                <button className="btn highlighted-btn">Download CV</button>
              </a>
              <button
                className="btn primary-btn"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Contact Me
              </button>
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div className="about-highlights">
          {highlights.map((h) => (
            <div className="highlight-card" key={h.label}>
              <div className="highlight-icon">
                <i className={`fa ${h.icon}`}></i>
              </div>
              <h4>{h.label}</h4>
              <p>{h.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
