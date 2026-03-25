import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import './admin.css';

const SECTIONS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'fa-th-large' },
  { id: 'projects', label: 'Projects', icon: 'fa-folder-open' },
  { id: 'profile', label: 'Profile', icon: 'fa-user' },
  { id: 'skills', label: 'Skills', icon: 'fa-code' },
  { id: 'settings', label: 'Settings', icon: 'fa-cog' },
];

const categoryOptions = ['fullstack', 'frontend', 'backend', 'mobile'];

const emptyProject = {
  title: '', description: '', tech: '', github: '', demo: '',
  category: 'fullstack', featured: false,
};

const emptySkill = { name: '', category: 'Frontend', level: 70 };
const skillCategories = ['Frontend', 'Backend', 'Database', 'Tools', 'Mobile'];

// Toast notification component
function Toast({ toasts, removeToast }) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <i className={`fa ${t.type === 'success' ? 'fa-check-circle' : t.type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}`}></i>
          <span>{t.message}</span>
          <button className="toast-close" onClick={() => removeToast(t.id)}>
            <i className="fa fa-times"></i>
          </button>
        </div>
      ))}
    </div>
  );
}

// Confirm dialog component
function ConfirmDialog({ open, title, message, onConfirm, onCancel, danger }) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onCancel]);

  if (!open) return null;
  return (
    <div className="admin-modal-overlay confirm-overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className={`confirm-icon ${danger ? 'danger' : ''}`}>
          <i className={`fa ${danger ? 'fa-trash' : 'fa-question-circle'}`}></i>
        </div>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="confirm-actions">
          <button className="admin-btn-ghost" onClick={onCancel}>Cancel</button>
          <button className={`admin-btn-primary ${danger ? 'admin-btn-danger' : ''}`} onClick={onConfirm}>
            {danger ? 'Delete' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const { isAdminLoggedIn, adminLogout, projects, addProject, updateProject, deleteProject,
    profile, updateProfile, skills, addSkill, updateSkill, deleteSkill } = usePortfolio();
  const navigate = useHistory();

  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Toast state
  const [toasts, setToasts] = useState([]);
  const toastId = useRef(0);

  const showToast = useCallback((message, type = 'success') => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Confirm dialog state
  const [confirmState, setConfirmState] = useState({ open: false, title: '', message: '', onConfirm: null, danger: false });

  const showConfirm = useCallback((title, message, onConfirm, danger = false) => {
    setConfirmState({ open: true, title, message, onConfirm, danger });
  }, []);

  const closeConfirm = useCallback(() => {
    setConfirmState({ open: false, title: '', message: '', onConfirm: null, danger: false });
  }, []);

  // Projects state
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState(emptyProject);
  const [projectSearch, setProjectSearch] = useState('');

  // Profile state
  const [profileForm, setProfileForm] = useState(profile);
  const [profileDirty, setProfileDirty] = useState(false);
  const [imagePreview, setImagePreview] = useState(profile.profileImage || '');

  // Skills state
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [skillForm, setSkillForm] = useState(emptySkill);
  const [skillSearch, setSkillSearch] = useState('');
  const [skillCategoryFilter, setSkillCategoryFilter] = useState('All');

  useEffect(() => {
    if (!isAdminLoggedIn) navigate.push('/admin/login');
  }, [isAdminLoggedIn, navigate]);

  useEffect(() => {
    setProfileForm(profile);
    setImagePreview(profile.profileImage || '');
    setProfileDirty(false);
  }, [profile]);

  // Escape key to close modals
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        if (showProjectModal) setShowProjectModal(false);
        if (showSkillModal) setShowSkillModal(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showProjectModal, showSkillModal]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setProfileForm((prev) => ({ ...prev, profileImage: reader.result }));
      setProfileDirty(true);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    setProfileForm((prev) => ({ ...prev, profileImage: '' }));
    setProfileDirty(true);
  };

  const handleProfileChange = (field, value) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
    setProfileDirty(true);
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
      showToast('Project updated successfully');
    } else {
      addProject(data);
      showToast('Project added successfully');
    }
    setShowProjectModal(false);
  };

  const handleDeleteProject = (id, title) => {
    showConfirm(
      'Delete Project',
      `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      () => { deleteProject(id); closeConfirm(); showToast('Project deleted', 'error'); },
      true
    );
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
    setProfileDirty(false);
    showToast('Profile updated successfully');
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
      showToast('Skill updated successfully');
    } else {
      addSkill(skillForm);
      showToast('Skill added successfully');
    }
    setShowSkillModal(false);
  };

  const handleDeleteSkill = (id, name) => {
    showConfirm(
      'Delete Skill',
      `Are you sure you want to delete "${name}"?`,
      () => { deleteSkill(id); closeConfirm(); showToast('Skill deleted', 'error'); },
      true
    );
  };

  const filteredSkills = skills
    .filter((s) => skillCategoryFilter === 'All' || s.category === skillCategoryFilter)
    .filter((s) => s.name.toLowerCase().includes(skillSearch.toLowerCase()));

  // ---------- Dashboard helpers ----------
  const skillsByCategory = skillCategories.map((cat) => ({
    name: cat,
    count: skills.filter((s) => s.category === cat).length,
    avg: skills.filter((s) => s.category === cat).length > 0
      ? Math.round(skills.filter((s) => s.category === cat).reduce((sum, s) => sum + s.level, 0) / skills.filter((s) => s.category === cat).length)
      : 0,
  }));

  const categoryColorMap = {
    Frontend: '#4ade80',
    Backend: '#60a5fa',
    Database: '#a78bfa',
    Tools: '#fbbf24',
    Mobile: '#ff7849',
  };

  if (!isAdminLoggedIn) return null;

  return (
    <div className="admin-layout">
      <Toast toasts={toasts} removeToast={removeToast} />
      <ConfirmDialog
        open={confirmState.open}
        title={confirmState.title}
        message={confirmState.message}
        onConfirm={confirmState.onConfirm}
        onCancel={closeConfirm}
        danger={confirmState.danger}
      />

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
                <h2>Welcome back, <span>{profile.name.split(' ')[0]}</span>!</h2>
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
                    {projects.length === 0 && (
                      <p className="empty-hint">No projects yet. Add your first project!</p>
                    )}
                  </div>
                </div>

                <div className="dashboard-card">
                  <div className="dashboard-card-header">
                    <h3>Skills Breakdown</h3>
                  </div>
                  <div className="skills-breakdown">
                    {skillsByCategory.filter((c) => c.count > 0).map((cat) => (
                      <div className="breakdown-item" key={cat.name}>
                        <div className="breakdown-header">
                          <span className="breakdown-name">
                            <span className="breakdown-dot" style={{ background: categoryColorMap[cat.name] }}></span>
                            {cat.name}
                          </span>
                          <span className="breakdown-meta">{cat.count} skills &middot; {cat.avg}% avg</span>
                        </div>
                        <div className="breakdown-bar-track">
                          <div
                            className="breakdown-bar-fill"
                            style={{ width: `${cat.avg}%`, background: categoryColorMap[cat.name] }}
                          ></div>
                        </div>
                      </div>
                    ))}
                    {skills.length === 0 && (
                      <p className="empty-hint">No skills added yet.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="dashboard-grid" style={{ marginTop: '24px' }}>
                <div className="dashboard-card">
                  <div className="dashboard-card-header">
                    <h3>Quick Actions</h3>
                  </div>
                  <div className="quick-actions">
                    <button className="quick-action-btn" onClick={() => { setActiveSection('projects'); setTimeout(openAddProject, 50); }}>
                      <i className="fa fa-plus"></i> Add Project
                    </button>
                    <button className="quick-action-btn" onClick={() => setActiveSection('profile')}>
                      <i className="fa fa-edit"></i> Edit Profile
                    </button>
                    <button className="quick-action-btn" onClick={() => { setActiveSection('skills'); setTimeout(openAddSkill, 50); }}>
                      <i className="fa fa-plus"></i> Add Skill
                    </button>
                    <a href="/" target="_blank" rel="noreferrer" className="quick-action-btn">
                      <i className="fa fa-eye"></i> Preview Site
                    </a>
                  </div>
                </div>

                <div className="dashboard-card">
                  <div className="dashboard-card-header">
                    <h3>Portfolio Status</h3>
                  </div>
                  <div className="status-list">
                    <div className="status-item">
                      <span className="status-dot status-dot-green"></span>
                      <span>Profile configured</span>
                      <i className="fa fa-check" style={{ color: '#4ade80', marginLeft: 'auto' }}></i>
                    </div>
                    <div className="status-item">
                      <span className={`status-dot ${projects.length > 0 ? 'status-dot-green' : 'status-dot-orange'}`}></span>
                      <span>{projects.length > 0 ? `${projects.length} projects added` : 'No projects yet'}</span>
                      {projects.length > 0
                        ? <i className="fa fa-check" style={{ color: '#4ade80', marginLeft: 'auto' }}></i>
                        : <i className="fa fa-exclamation" style={{ color: '#ff7849', marginLeft: 'auto' }}></i>
                      }
                    </div>
                    <div className="status-item">
                      <span className={`status-dot ${skills.length > 0 ? 'status-dot-green' : 'status-dot-orange'}`}></span>
                      <span>{skills.length > 0 ? `${skills.length} skills listed` : 'No skills yet'}</span>
                      {skills.length > 0
                        ? <i className="fa fa-check" style={{ color: '#4ade80', marginLeft: 'auto' }}></i>
                        : <i className="fa fa-exclamation" style={{ color: '#ff7849', marginLeft: 'auto' }}></i>
                      }
                    </div>
                    <div className="status-item">
                      <span className={`status-dot ${profile.cvFile ? 'status-dot-green' : 'status-dot-red'}`}></span>
                      <span>{profile.cvFile ? 'CV uploaded' : 'No CV file'}</span>
                      {profile.cvFile
                        ? <i className="fa fa-check" style={{ color: '#4ade80', marginLeft: 'auto' }}></i>
                        : <i className="fa fa-times" style={{ color: '#f87171', marginLeft: 'auto' }}></i>
                      }
                    </div>
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
                  <div className="search-wrapper">
                    <i className="fa fa-search search-icon"></i>
                    <input
                      type="text"
                      placeholder="Search projects..."
                      className="admin-search"
                      value={projectSearch}
                      onChange={(e) => setProjectSearch(e.target.value)}
                    />
                    {projectSearch && (
                      <button className="search-clear" onClick={() => setProjectSearch('')}>
                        <i className="fa fa-times"></i>
                      </button>
                    )}
                  </div>
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
                          <p>{projectSearch ? 'No projects match your search' : 'No projects found'}</p>
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
                              {(Array.isArray(p.tech) ? p.tech : p.tech?.split(','))?.length > 3 && (
                                <span className="mini-tech-tag more-tag">+{(Array.isArray(p.tech) ? p.tech.length : p.tech?.split(',').length) - 3}</span>
                              )}
                            </div>
                          </td>
                          <td>
                            <button
                              className={`featured-toggle${p.featured ? ' on' : ''}`}
                              onClick={() => {
                                updateProject(p.id, { featured: !p.featured });
                                showToast(p.featured ? 'Removed from featured' : 'Marked as featured', 'info');
                              }}
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
                                onClick={() => handleDeleteProject(p.id, p.title)}
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
                {profileDirty && (
                  <div className="unsaved-badge">
                    <i className="fa fa-circle"></i> Unsaved changes
                  </div>
                )}
              </div>

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
                      onChange={(e) => handleProfileChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Title / Role</label>
                    <input
                      type="text"
                      value={profileForm.title || ''}
                      onChange={(e) => handleProfileChange('title', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={profileForm.email || ''}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Phone</label>
                    <input
                      type="text"
                      value={profileForm.phone || ''}
                      onChange={(e) => handleProfileChange('phone', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      value={profileForm.location || ''}
                      onChange={(e) => handleProfileChange('location', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Years of Experience</label>
                    <input
                      type="text"
                      value={profileForm.experience || ''}
                      onChange={(e) => handleProfileChange('experience', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Projects Count (display)</label>
                    <input
                      type="text"
                      value={profileForm.projectsCount || ''}
                      onChange={(e) => handleProfileChange('projectsCount', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Clients Count (display)</label>
                    <input
                      type="text"
                      value={profileForm.clientsCount || ''}
                      onChange={(e) => handleProfileChange('clientsCount', e.target.value)}
                    />
                  </div>
                </div>

                <div className="admin-form-group full-width">
                  <label>Bio</label>
                  <textarea
                    rows="4"
                    value={profileForm.bio || ''}
                    onChange={(e) => handleProfileChange('bio', e.target.value)}
                  ></textarea>
                </div>

                <div className="admin-form-group full-width">
                  <label>Typing Roles (comma-separated)</label>
                  <input
                    type="text"
                    value={Array.isArray(profileForm.roles) ? profileForm.roles.join(', ') : profileForm.roles || ''}
                    onChange={(e) => handleProfileChange('roles', e.target.value)}
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
                      onChange={(e) => handleProfileChange('twitter', e.target.value)}
                      placeholder="https://twitter.com/..."
                    />
                  </div>
                  <div className="admin-form-group">
                    <label><i className="fa fa-linkedin"></i> LinkedIn</label>
                    <input
                      type="url"
                      value={profileForm.linkedin || ''}
                      onChange={(e) => handleProfileChange('linkedin', e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div className="admin-form-group">
                    <label><i className="fa fa-github"></i> GitHub</label>
                    <input
                      type="text"
                      value={profileForm.github || ''}
                      onChange={(e) => handleProfileChange('github', e.target.value)}
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <div className="admin-form-group">
                    <label><i className="fa fa-facebook"></i> Facebook</label>
                    <input
                      type="text"
                      value={profileForm.facebook || ''}
                      onChange={(e) => handleProfileChange('facebook', e.target.value)}
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                </div>

                <div className="admin-form-group full-width">
                  <label>CV File Name (in /public folder)</label>
                  <input
                    type="text"
                    value={profileForm.cvFile || ''}
                    onChange={(e) => handleProfileChange('cvFile', e.target.value)}
                    placeholder="resume.pdf"
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className={`admin-btn-primary ${profileDirty ? 'pulse-save' : ''}`}>
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
                <div className="content-header-right">
                  <div className="search-wrapper">
                    <i className="fa fa-search search-icon"></i>
                    <input
                      type="text"
                      placeholder="Search skills..."
                      className="admin-search"
                      value={skillSearch}
                      onChange={(e) => setSkillSearch(e.target.value)}
                    />
                    {skillSearch && (
                      <button className="search-clear" onClick={() => setSkillSearch('')}>
                        <i className="fa fa-times"></i>
                      </button>
                    )}
                  </div>
                  <button className="admin-btn-primary" onClick={openAddSkill}>
                    <i className="fa fa-plus"></i> Add Skill
                  </button>
                </div>
              </div>

              <div className="skills-category-filters">
                {['All', ...skillCategories].map((cat) => (
                  <button
                    key={cat}
                    className={`skill-filter-btn${skillCategoryFilter === cat ? ' active' : ''}`}
                    onClick={() => setSkillCategoryFilter(cat)}
                  >
                    {cat}
                    {cat !== 'All' && (
                      <span className="filter-count">{skills.filter((s) => s.category === cat).length}</span>
                    )}
                  </button>
                ))}
              </div>

              <div className="skills-admin-grid">
                {filteredSkills.length === 0 ? (
                  <div className="skills-empty">
                    <i className="fa fa-code"></i>
                    <p>{skillSearch || skillCategoryFilter !== 'All' ? 'No skills match your filter' : 'No skills added yet'}</p>
                  </div>
                ) : (
                  filteredSkills.map((s) => (
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
                          <button className="table-action-btn delete" onClick={() => handleDeleteSkill(s.id, s.name)}>
                            <i className="fa fa-trash"></i>
                          </button>
                        </div>
                      </div>
                      <div className="skill-admin-bar-track">
                        <div className="skill-admin-bar-fill" style={{ width: `${s.level}%` }}></div>
                      </div>
                      <span className="skill-admin-level">{s.level}%</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ===== SETTINGS ===== */}
          {activeSection === 'settings' && (
            <div className="section-content">
              <div className="content-header">
                <div className="content-header-left">
                  <h2>Settings</h2>
                  <p>Manage your admin panel preferences</p>
                </div>
              </div>

              <div className="settings-grid">
                <div className="settings-card">
                  <div className="settings-card-icon"><i className="fa fa-database"></i></div>
                  <div className="settings-card-info">
                    <h4>Data Management</h4>
                    <p>Export or reset your portfolio data</p>
                  </div>
                  <div className="settings-card-actions">
                    <button
                      className="admin-btn-sm"
                      onClick={() => {
                        const data = {
                          profile: JSON.parse(localStorage.getItem('portfolio_profile') || '{}'),
                          projects: JSON.parse(localStorage.getItem('portfolio_projects') || '[]'),
                          skills: JSON.parse(localStorage.getItem('portfolio_skills') || '[]'),
                        };
                        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'portfolio-backup.json';
                        a.click();
                        URL.revokeObjectURL(url);
                        showToast('Backup downloaded');
                      }}
                    >
                      <i className="fa fa-download"></i> Export Data
                    </button>
                    <label className="admin-btn-sm import-btn-label">
                      <i className="fa fa-upload"></i> Import Data
                      <input
                        type="file"
                        accept=".json"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            try {
                              const data = JSON.parse(ev.target.result);
                              if (data.profile) {
                                updateProfile(data.profile);
                              }
                              if (data.projects && Array.isArray(data.projects)) {
                                localStorage.setItem('portfolio_projects', JSON.stringify(data.projects));
                              }
                              if (data.skills && Array.isArray(data.skills)) {
                                localStorage.setItem('portfolio_skills', JSON.stringify(data.skills));
                              }
                              showToast('Data imported! Reload to see all changes.');
                            } catch {
                              showToast('Invalid JSON file', 'error');
                            }
                          };
                          reader.readAsText(file);
                          e.target.value = '';
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="settings-card">
                  <div className="settings-card-icon"><i className="fa fa-refresh"></i></div>
                  <div className="settings-card-info">
                    <h4>Reset to Defaults</h4>
                    <p>Restore all data to the original demo content</p>
                  </div>
                  <div className="settings-card-actions">
                    <button
                      className="admin-btn-sm admin-btn-sm-danger"
                      onClick={() => {
                        showConfirm(
                          'Reset All Data',
                          'This will restore all portfolio data to defaults. All your changes will be lost. Are you sure?',
                          () => {
                            localStorage.removeItem('portfolio_projects');
                            localStorage.removeItem('portfolio_profile');
                            localStorage.removeItem('portfolio_skills');
                            closeConfirm();
                            showToast('Data reset! Reloading...', 'info');
                            setTimeout(() => window.location.reload(), 1200);
                          },
                          true
                        );
                      }}
                    >
                      <i className="fa fa-exclamation-triangle"></i> Reset All
                    </button>
                  </div>
                </div>

                <div className="settings-card">
                  <div className="settings-card-icon"><i className="fa fa-keyboard-o"></i></div>
                  <div className="settings-card-info">
                    <h4>Keyboard Shortcuts</h4>
                    <p>Quick shortcuts for faster navigation</p>
                  </div>
                  <div className="shortcuts-list">
                    <div className="shortcut-item">
                      <kbd>Esc</kbd>
                      <span>Close modals & dialogs</span>
                    </div>
                    <div className="shortcut-item">
                      <kbd>Click overlay</kbd>
                      <span>Dismiss modal</span>
                    </div>
                  </div>
                </div>

                <div className="settings-card">
                  <div className="settings-card-icon"><i className="fa fa-info-circle"></i></div>
                  <div className="settings-card-info">
                    <h4>About</h4>
                    <p>Portfolio CMS Admin Panel v2.0</p>
                  </div>
                  <div className="settings-about-meta">
                    <span>Built with React {React.version}</span>
                    <span>Data stored in localStorage</span>
                  </div>
                </div>
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
                  autoFocus
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
                  autoFocus
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
                <div className="range-labels">
                  <span>Beginner</span>
                  <span>Expert</span>
                </div>
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
