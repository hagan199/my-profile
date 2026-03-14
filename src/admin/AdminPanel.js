import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import './admin.css';

const SECTIONS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'fa-th-large' },
  { id: 'projects', label: 'Projects', icon: 'fa-folder-open' },
  { id: 'profile', label: 'Profile', icon: 'fa-user' },
  { id: 'skills', label: 'Skills', icon: 'fa-code' },
];

const categoryOptions = ['fullstack', 'frontend', 'backend', 'mobile'];

const emptyProject = {
  title: '', description: '', tech: '', github: '', demo: '',
  category: 'fullstack', featured: false,
};

const emptySkill = { name: '', category: 'Frontend', level: 70 };
const skillCategories = ['Frontend', 'Backend', 'Database', 'Tools', 'Mobile'];

export default function AdminPanel() {
  const { isAdminLoggedIn, adminLogout, projects, addProject, updateProject, deleteProject,
    profile, updateProfile, skills, addSkill, updateSkill, deleteSkill } = usePortfolio();
  const navigate = useHistory();

  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Projects state
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState(emptyProject);
  const [projectSearch, setProjectSearch] = useState('');

  // Profile state
  const [profileForm, setProfileForm] = useState(profile);
  const [profileSaved, setProfileSaved] = useState(false);
  const [imagePreview, setImagePreview] = useState(profile.profileImage || '');

  // Skills state
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [skillForm, setSkillForm] = useState(emptySkill);

  useEffect(() => {
    if (!isAdminLoggedIn) navigate.push('/admin/login');
  }, [isAdminLoggedIn, navigate]);

  useEffect(() => {
    setProfileForm(profile);
    setImagePreview(profile.profileImage || '');
  }, [profile]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setProfileForm((prev) => ({ ...prev, profileImage: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    setProfileForm((prev) => ({ ...prev, profileImage: '' }));
  };

  const handleLogout = () => {
    adminLogout();
    navigate.push('/admin/login');
  };

  // ---------- Projects ----------
  const openAddProject = () => {
    setEditingProject(null);
    setProjectForm(emptyProject);
    setShowProjectModal(true);
  };

  const openEditProject = (p) => {
    setEditingProject(p);
    setProjectForm({ ...p, tech: Array.isArray(p.tech) ? p.tech.join(', ') : p.tech });
    setShowProjectModal(true);
  };

  const handleProjectSubmit = (e) => {
    e.preventDefault();
    const techArray = projectForm.tech.split(',').map((t) => t.trim()).filter(Boolean);
    const data = { ...projectForm, tech: techArray };
    if (editingProject) {
      updateProject(editingProject.id, data);
    } else {
      addProject(data);
    }
    setShowProjectModal(false);
  };

  const handleDeleteProject = (id) => {
    if (window.confirm('Delete this project?')) deleteProject(id);
  };

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(projectSearch.toLowerCase())
  );

  // ---------- Profile ----------
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const rolesArray = typeof profileForm.roles === 'string'
      ? profileForm.roles.split(',').map((r) => r.trim()).filter(Boolean)
      : profileForm.roles;
    updateProfile({ ...profileForm, roles: rolesArray });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  // ---------- Skills ----------
  const openAddSkill = () => {
    setEditingSkill(null);
    setSkillForm(emptySkill);
    setShowSkillModal(true);
  };

  const openEditSkill = (s) => {
    setEditingSkill(s);
    setSkillForm({ ...s });
    setShowSkillModal(true);
  };

  const handleSkillSubmit = (e) => {
    e.preventDefault();
    if (editingSkill) {
      updateSkill(editingSkill.id, skillForm);
    } else {
      addSkill(skillForm);
    }
    setShowSkillModal(false);
  };

  const handleDeleteSkill = (id) => {
    if (window.confirm('Delete this skill?')) deleteSkill(id);
  };

  if (!isAdminLoggedIn) return null;

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-bracket">&lt;</span>EH<span className="logo-bracket">/&gt;</span>
          </div>
          <p className="sidebar-sub">Admin Panel</p>
        </div>

        <nav className="sidebar-nav">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              className={`sidebar-nav-item${activeSection === s.id ? ' active' : ''}`}
              onClick={() => { setActiveSection(s.id); setSidebarOpen(false); }}
            >
              <i className={`fa ${s.icon}`}></i>
              <span>{s.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <a href="/" className="sidebar-nav-item" target="_blank" rel="noreferrer">
            <i className="fa fa-eye"></i>
            <span>View Site</span>
          </a>
          <button className="sidebar-nav-item logout-btn" onClick={handleLogout}>
            <i className="fa fa-sign-out"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Main */}
      <main className="admin-main">
        {/* Top bar */}
        <header className="admin-topbar">
          <button
            className="topbar-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <i className="fa fa-bars"></i>
          </button>
          <div className="topbar-title">
            {SECTIONS.find((s) => s.id === activeSection)?.label}
          </div>
          <div className="topbar-user">
            <div className="topbar-avatar">EH</div>
            <span>Admin</span>
          </div>
        </header>

        <div className="admin-content">
          {/* ===== DASHBOARD ===== */}
          {activeSection === 'dashboard' && (
            <div className="dashboard">
              <div className="dashboard-welcome">
                <h2>Welcome back, <span>{profile.name.split(' ')[0]}</span>! 👋</h2>
                <p>Here's an overview of your portfolio</p>
              </div>

              <div className="stats-grid">
                <div className="stat-card stat-orange">
                  <div className="stat-card-icon"><i className="fa fa-folder"></i></div>
                  <div className="stat-card-info">
                    <span className="stat-card-value">{projects.length}</span>
                    <span className="stat-card-label">Total Projects</span>
                  </div>
                </div>
                <div className="stat-card stat-blue">
                  <div className="stat-card-icon"><i className="fa fa-star"></i></div>
                  <div className="stat-card-info">
                    <span className="stat-card-value">{projects.filter((p) => p.featured).length}</span>
                    <span className="stat-card-label">Featured Projects</span>
                  </div>
                </div>
                <div className="stat-card stat-purple">
                  <div className="stat-card-icon"><i className="fa fa-code"></i></div>
                  <div className="stat-card-info">
                    <span className="stat-card-value">{skills.length}</span>
                    <span className="stat-card-label">Skills Listed</span>
                  </div>
                </div>
                <div className="stat-card stat-green">
                  <div className="stat-card-icon"><i className="fa fa-check-circle"></i></div>
                  <div className="stat-card-info">
                    <span className="stat-card-value">{profile.experience}</span>
                    <span className="stat-card-label">Years Experience</span>
                  </div>
                </div>
              </div>

              <div className="dashboard-grid">
                <div className="dashboard-card">
                  <div className="dashboard-card-header">
                    <h3>Recent Projects</h3>
                    <button className="admin-btn-sm" onClick={() => setActiveSection('projects')}>
                      View All
                    </button>
                  </div>
                  <div className="recent-projects-list">
                    {projects.slice(0, 4).map((p) => (
                      <div className="recent-project-item" key={p.id}>
                        <div className="recent-project-info">
                          <span className="recent-project-title">{p.title}</span>
                          <span className="recent-project-cat">{p.category}</span>
                        </div>
                        {p.featured && <span className="mini-badge">Featured</span>}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="dashboard-card">
                  <div className="dashboard-card-header">
                    <h3>Quick Actions</h3>
                  </div>
                  <div className="quick-actions">
                    <button className="quick-action-btn" onClick={() => { setActiveSection('projects'); openAddProject(); }}>
                      <i className="fa fa-plus"></i> Add Project
                    </button>
                    <button className="quick-action-btn" onClick={() => setActiveSection('profile')}>
                      <i className="fa fa-edit"></i> Edit Profile
                    </button>
                    <button className="quick-action-btn" onClick={() => { setActiveSection('skills'); openAddSkill(); }}>
                      <i className="fa fa-plus"></i> Add Skill
                    </button>
                    <a href="/" target="_blank" rel="noreferrer" className="quick-action-btn">
                      <i className="fa fa-eye"></i> Preview Site
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== PROJECTS ===== */}
          {activeSection === 'projects' && (
            <div className="section-content">
              <div className="content-header">
                <div className="content-header-left">
                  <h2>Projects</h2>
                  <p>{projects.length} total projects</p>
                </div>
                <div className="content-header-right">
                  <input
                    type="text"
                    placeholder="Search projects..."
                    className="admin-search"
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                  />
                  <button className="admin-btn-primary" onClick={openAddProject}>
                    <i className="fa fa-plus"></i> Add Project
                  </button>
                </div>
              </div>

              <div className="projects-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Tech Stack</th>
                      <th>Featured</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="table-empty">
                          <i className="fa fa-folder-open"></i>
                          <p>No projects found</p>
                        </td>
                      </tr>
                    ) : (
                      filteredProjects.map((p) => (
                        <tr key={p.id}>
                          <td>
                            <div className="table-project-title">{p.title}</div>
                            <div className="table-project-desc">{p.description?.slice(0, 60)}...</div>
                          </td>
                          <td>
                            <span className={`category-pill cat-${p.category}`}>{p.category}</span>
                          </td>
                          <td>
                            <div className="table-tech-tags">
                              {(Array.isArray(p.tech) ? p.tech : p.tech?.split(',').map((t) => t.trim()))
                                ?.slice(0, 3)
                                .map((t) => (
                                  <span key={t} className="mini-tech-tag">{t}</span>
                                ))}
                            </div>
                          </td>
                          <td>
                            <button
                              className={`featured-toggle${p.featured ? ' on' : ''}`}
                              onClick={() => updateProject(p.id, { featured: !p.featured })}
                              title="Toggle featured"
                            >
                              <i className={`fa fa-star${p.featured ? '' : '-o'}`}></i>
                            </button>
                          </td>
                          <td>
                            <div className="table-actions">
                              <button
                                className="table-action-btn edit"
                                onClick={() => openEditProject(p)}
                                title="Edit"
                              >
                                <i className="fa fa-edit"></i>
                              </button>
                              <button
                                className="table-action-btn delete"
                                onClick={() => handleDeleteProject(p.id)}
                                title="Delete"
                              >
                                <i className="fa fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===== PROFILE ===== */}
          {activeSection === 'profile' && (
            <div className="section-content">
              <div className="content-header">
                <div className="content-header-left">
                  <h2>Profile Settings</h2>
                  <p>Update your personal information</p>
                </div>
              </div>

              {profileSaved && (
                <div className="admin-alert admin-alert-success">
                  <i className="fa fa-check-circle"></i> Profile updated successfully!
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="profile-form">
                <div className="form-section-label">Profile Picture</div>
                <div className="profile-image-upload">
                  <div className="profile-image-preview">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Profile" />
                    ) : (
                      <div className="profile-image-placeholder">
                        <i className="fa fa-user"></i>
                      </div>
                    )}
                  </div>
                  <div className="profile-image-actions">
                    <label className="admin-btn-primary upload-btn">
                      <i className="fa fa-upload"></i> Upload Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                    </label>
                    {imagePreview && (
                      <button type="button" className="admin-btn-ghost" onClick={handleRemoveImage}>
                        <i className="fa fa-trash"></i> Remove
                      </button>
                    )}
                    <p className="upload-hint">Recommended: Square image, at least 400x400px</p>
                  </div>
                </div>

                <div className="form-section-label">Personal Info</div>
                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={profileForm.name || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Title / Role</label>
                    <input
                      type="text"
                      value={profileForm.title || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={profileForm.email || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Phone</label>
                    <input
                      type="text"
                      value={profileForm.phone || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      value={profileForm.location || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Years of Experience</label>
                    <input
                      type="text"
                      value={profileForm.experience || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, experience: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Projects Count (display)</label>
                    <input
                      type="text"
                      value={profileForm.projectsCount || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, projectsCount: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Clients Count (display)</label>
                    <input
                      type="text"
                      value={profileForm.clientsCount || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, clientsCount: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-form-group full-width">
                  <label>Bio</label>
                  <textarea
                    rows="4"
                    value={profileForm.bio || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  ></textarea>
                </div>

                <div className="admin-form-group full-width">
                  <label>Typing Roles (comma-separated)</label>
                  <input
                    type="text"
                    value={Array.isArray(profileForm.roles) ? profileForm.roles.join(', ') : profileForm.roles || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, roles: e.target.value })}
                    placeholder="MERN Stack Dev, React Dev, ..."
                  />
                </div>

                <div className="form-section-label">Social Links</div>
                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label><i className="fa fa-twitter"></i> Twitter</label>
                    <input
                      type="url"
                      value={profileForm.twitter || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, twitter: e.target.value })}
                      placeholder="https://twitter.com/..."
                    />
                  </div>
                  <div className="admin-form-group">
                    <label><i className="fa fa-linkedin"></i> LinkedIn</label>
                    <input
                      type="url"
                      value={profileForm.linkedin || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div className="admin-form-group">
                    <label><i className="fa fa-github"></i> GitHub</label>
                    <input
                      type="text"
                      value={profileForm.github || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <div className="admin-form-group">
                    <label><i className="fa fa-facebook"></i> Facebook</label>
                    <input
                      type="text"
                      value={profileForm.facebook || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, facebook: e.target.value })}
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                </div>

                <div className="admin-form-group full-width">
                  <label>CV File Name (in /public folder)</label>
                  <input
                    type="text"
                    value={profileForm.cvFile || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, cvFile: e.target.value })}
                    placeholder="resume.pdf"
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="admin-btn-primary">
                    <i className="fa fa-save"></i> Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ===== SKILLS ===== */}
          {activeSection === 'skills' && (
            <div className="section-content">
              <div className="content-header">
                <div className="content-header-left">
                  <h2>Skills</h2>
                  <p>{skills.length} skills listed</p>
                </div>
                <button className="admin-btn-primary" onClick={openAddSkill}>
                  <i className="fa fa-plus"></i> Add Skill
                </button>
              </div>

              <div className="skills-admin-grid">
                {skills.map((s) => (
                  <div className="skill-admin-card" key={s.id}>
                    <div className="skill-admin-top">
                      <div>
                        <span className="skill-admin-name">{s.name}</span>
                        <span className="skill-admin-cat">{s.category}</span>
                      </div>
                      <div className="table-actions">
                        <button className="table-action-btn edit" onClick={() => openEditSkill(s)}>
                          <i className="fa fa-edit"></i>
                        </button>
                        <button className="table-action-btn delete" onClick={() => handleDeleteSkill(s.id)}>
                          <i className="fa fa-trash"></i>
                        </button>
                      </div>
                    </div>
                    <div className="skill-admin-bar-track">
                      <div className="skill-admin-bar-fill" style={{ width: `${s.level}%` }}></div>
                    </div>
                    <span className="skill-admin-level">{s.level}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ===== PROJECT MODAL ===== */}
      {showProjectModal && (
        <div className="admin-modal-overlay" onClick={() => setShowProjectModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProject ? 'Edit Project' : 'Add New Project'}</h3>
              <button className="modal-close" onClick={() => setShowProjectModal(false)}>
                <i className="fa fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleProjectSubmit} className="modal-form">
              <div className="admin-form-group">
                <label>Project Title *</label>
                <input
                  type="text"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  required
                  placeholder="My Awesome Project"
                />
              </div>
              <div className="admin-form-group">
                <label>Description *</label>
                <textarea
                  rows="3"
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  required
                  placeholder="What does this project do?"
                ></textarea>
              </div>
              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label>Category</label>
                  <select
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                  >
                    {categoryOptions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Tech Stack (comma-separated)</label>
                  <input
                    type="text"
                    value={projectForm.tech}
                    onChange={(e) => setProjectForm({ ...projectForm, tech: e.target.value })}
                    placeholder="React, Node.js, MongoDB"
                  />
                </div>
                <div className="admin-form-group">
                  <label>GitHub URL</label>
                  <input
                    type="text"
                    value={projectForm.github}
                    onChange={(e) => setProjectForm({ ...projectForm, github: e.target.value })}
                    placeholder="https://github.com/..."
                  />
                </div>
                <div className="admin-form-group">
                  <label>Demo URL</label>
                  <input
                    type="text"
                    value={projectForm.demo}
                    onChange={(e) => setProjectForm({ ...projectForm, demo: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="admin-form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={projectForm.featured}
                    onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                  />
                  <span>Mark as Featured Project</span>
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" className="admin-btn-ghost" onClick={() => setShowProjectModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  <i className="fa fa-save"></i> {editingProject ? 'Update' : 'Add'} Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== SKILL MODAL ===== */}
      {showSkillModal && (
        <div className="admin-modal-overlay" onClick={() => setShowSkillModal(false)}>
          <div className="admin-modal admin-modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingSkill ? 'Edit Skill' : 'Add New Skill'}</h3>
              <button className="modal-close" onClick={() => setShowSkillModal(false)}>
                <i className="fa fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleSkillSubmit} className="modal-form">
              <div className="admin-form-group">
                <label>Skill Name *</label>
                <input
                  type="text"
                  value={skillForm.name}
                  onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                  required
                  placeholder="e.g. React.js"
                />
              </div>
              <div className="admin-form-group">
                <label>Category</label>
                <select
                  value={skillForm.category}
                  onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                >
                  {skillCategories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="admin-form-group">
                <label>Proficiency Level: <strong>{skillForm.level}%</strong></label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={skillForm.level}
                  onChange={(e) => setSkillForm({ ...skillForm, level: Number(e.target.value) })}
                  className="skill-range"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="admin-btn-ghost" onClick={() => setShowSkillModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  <i className="fa fa-save"></i> {editingSkill ? 'Update' : 'Add'} Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
