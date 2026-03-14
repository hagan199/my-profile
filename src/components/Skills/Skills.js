import React, { useState, useEffect, useRef } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import './Skills.css';

const categories = ['All', 'Frontend', 'Backend', 'Database', 'Tools', 'Mobile'];

export default function Skills() {
  const { skills } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState('All');
  const [animated, setAnimated] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const filtered =
    activeCategory === 'All'
      ? skills
      : skills.filter((s) => s.category === activeCategory);

  return (
    <section id="skills" className="section skills-section" ref={sectionRef}>
      <div className="skills-container">
        <div className="section-title">
          <h2>My <span>Skills</span></h2>
          <p>Technologies and tools I work with</p>
          <span className="title-line"></span>
        </div>

        <div className="skills-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn${activeCategory === cat ? ' active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="skills-grid">
          {filtered.map((skill) => (
            <div className="skill-card" key={skill.id}>
              <div className="skill-info">
                <span className="skill-name">{skill.name}</span>
                <span className="skill-level">{skill.level}%</span>
              </div>
              <div className="skill-bar-track">
                <div
                  className="skill-bar-fill"
                  style={{ width: animated ? `${skill.level}%` : '0%' }}
                ></div>
              </div>
              <span className="skill-category-tag">{skill.category}</span>
            </div>
          ))}
        </div>

        {/* Tech stack badges */}
        <div className="tech-badges">
          {['React', 'Node.js', 'PHP', 'MongoDB', 'MySQL', 'Express', 'Laravel', 'Git', 'Docker', 'Bootstrap', 'JavaScript', 'HTML5', 'CSS3', 'REST APIs'].map((tech) => (
            <span key={tech} className="tech-badge">{tech}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
