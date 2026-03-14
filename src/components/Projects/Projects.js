import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import './Projects.css';

const categories = ['All', 'fullstack', 'frontend', 'backend', 'mobile'];

const categoryLabels = {
  fullstack: 'Full Stack',
  frontend: 'Frontend',
  backend: 'Backend',
  mobile: 'Mobile',
};

export default function Projects() {
  const { projects } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered =
    activeCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="section projects-section">
      <div className="projects-container">
        <div className="section-title">
          <h2>My <span>Projects</span></h2>
          <p>A selection of things I've built</p>
          <span className="title-line"></span>
        </div>

        <div className="projects-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn${activeCategory === cat ? ' active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat === 'All' ? 'All' : categoryLabels[cat]}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="no-projects">
            <i className="fa fa-folder-open"></i>
            <p>No projects in this category yet.</p>
          </div>
        ) : (
          <div className="projects-grid">
            {filtered.map((project) => (
              <div className={`project-card${project.featured ? ' featured' : ''}`} key={project.id}>
                {project.featured && (
                  <div className="featured-badge">
                    <i className="fa fa-star"></i> Featured
                  </div>
                )}

                <div className="project-header">
                  <div className="project-icon">
                    <i className="fa fa-code"></i>
                  </div>
                  <div className="project-links">
                    {project.github && project.github !== '#' && (
                      <a href={project.github} target="_blank" rel="noreferrer" title="GitHub">
                        <i className="fa fa-github"></i>
                      </a>
                    )}
                    {project.demo && project.demo !== '#' && (
                      <a href={project.demo} target="_blank" rel="noreferrer" title="Live Demo">
                        <i className="fa fa-external-link"></i>
                      </a>
                    )}
                  </div>
                </div>

                <h3 className="project-title">{project.title}</h3>
                <p className="project-desc">{project.description}</p>

                <div className="project-tech">
                  {(Array.isArray(project.tech)
                    ? project.tech
                    : project.tech.split(',').map((t) => t.trim())
                  ).map((tech) => (
                    <span key={tech} className="tech-tag">{tech}</span>
                  ))}
                </div>

                <span className="project-category-label">
                  {categoryLabels[project.category] || project.category}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
