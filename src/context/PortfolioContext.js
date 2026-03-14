import React, { createContext, useContext, useState, useEffect } from 'react';

const PortfolioContext = createContext();

const defaultProjects = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description: 'Full-stack e-commerce application with product management, shopping cart, Stripe payments, and a comprehensive admin dashboard.',
    tech: ['React', 'Node.js', 'MongoDB', 'Express', 'Stripe'],
    github: '#',
    demo: '#',
    category: 'fullstack',
    featured: true,
  },
  {
    id: 2,
    title: 'Task Management App',
    description: 'Real-time collaborative task manager with drag-and-drop boards, team roles, and Firebase sync.',
    tech: ['React', 'Firebase', 'Material UI', 'DnD'],
    github: '#',
    demo: '#',
    category: 'frontend',
    featured: false,
  },
  {
    id: 3,
    title: 'REST API with JWT Auth',
    description: 'Secure RESTful API with JWT authentication, refresh tokens, role-based access control, and comprehensive Swagger docs.',
    tech: ['Node.js', 'Express', 'MongoDB', 'JWT'],
    github: '#',
    demo: '#',
    category: 'backend',
    featured: false,
  },
  {
    id: 4,
    title: 'School Management System',
    description: 'PHP-based system for managing students, teachers, grades, and attendance with a dynamic dashboard.',
    tech: ['PHP', 'Laravel', 'MySQL', 'Bootstrap'],
    github: '#',
    demo: '#',
    category: 'fullstack',
    featured: true,
  },
];

const defaultProfile = {
  name: 'Emmanuel Hagan',
  title: 'Full-Stack Engineer – Backend, Platform & AI Automation',
  bio: 'Full-Stack Developer with 5+ years of experience building impactful, user-friendly, and scalable solutions. My expertise spans Laravel, Django, Vue.js, React, PHP, Node.js, MySQL, and other modern technologies, with a strong emphasis on maintainable code and high-quality user experiences. I focus on API performance optimization, business process automation, and payment system integration — always with the goal of empowering SMEs through accessible technology.',
  email: 'haganemmanuel23@gmail.com',
  phone: '+233 547 555 528',
  location: 'Accra, Greater Accra Region, Ghana',
  twitter: '#',
  linkedin: 'https://www.linkedin.com/in/emmanuelhagan',
  github: 'https://github.com/hagan199',
  facebook: '#',
  roles: ['Full-Stack Engineer', 'Laravel / PHP Dev', 'AI Automation Dev', 'Backend Engineer', 'Vue.js / React Dev'],
  profileImage: '',
  cvFile: 'EMMANUEL HAGAN-CV-2021-12-21.pdf',
  experience: '5+',
  projectsCount: '20+',
  clientsCount: '10+',
};

const defaultSkills = [
  { id: 1, category: 'Frontend', name: 'React.js', level: 90 },
  { id: 2, category: 'Frontend', name: 'JavaScript (ES6+)', level: 88 },
  { id: 3, category: 'Frontend', name: 'HTML5 & CSS3', level: 92 },
  { id: 4, category: 'Frontend', name: 'Bootstrap / Tailwind', level: 85 },
  { id: 5, category: 'Backend', name: 'Node.js & Express', level: 82 },
  { id: 6, category: 'Backend', name: 'PHP & Laravel', level: 78 },
  { id: 7, category: 'Backend', name: 'REST APIs', level: 85 },
  { id: 8, category: 'Database', name: 'MongoDB', level: 80 },
  { id: 9, category: 'Database', name: 'MySQL', level: 75 },
  { id: 10, category: 'Tools', name: 'Git & GitHub', level: 85 },
  { id: 11, category: 'Tools', name: 'VS Code', level: 95 },
  { id: 12, category: 'Mobile', name: 'React Native', level: 65 },
];

export function PortfolioProvider({ children }) {
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('portfolio_projects');
    return saved ? JSON.parse(saved) : defaultProjects;
  });

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('portfolio_profile');
    return saved ? { ...defaultProfile, ...JSON.parse(saved) } : defaultProfile;
  });

  const [skills, setSkills] = useState(() => {
    const saved = localStorage.getItem('portfolio_skills');
    return saved ? JSON.parse(saved) : defaultSkills;
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('admin_token') === 'authenticated';
  });

  useEffect(() => {
    localStorage.setItem('portfolio_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('portfolio_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('portfolio_skills', JSON.stringify(skills));
  }, [skills]);

  const addProject = (project) => {
    setProjects((prev) => [...prev, { ...project, id: Date.now() }]);
  };

  const updateProject = (id, updates) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProject = (id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const updateProfile = (updates) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const addSkill = (skill) => {
    setSkills((prev) => [...prev, { ...skill, id: Date.now() }]);
  };

  const updateSkill = (id, updates) => {
    setSkills((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteSkill = (id) => {
    setSkills((prev) => prev.filter((s) => s.id !== id));
  };

  const adminLogin = (password) => {
    if (password === 'admin@hagan2024') {
      localStorage.setItem('admin_token', 'authenticated');
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAdminLoggedIn(false);
  };

  return (
    <PortfolioContext.Provider
      value={{
        projects, addProject, updateProject, deleteProject,
        profile, updateProfile,
        skills, addSkill, updateSkill, deleteSkill,
        isAdminLoggedIn, adminLogin, adminLogout,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export const usePortfolio = () => useContext(PortfolioContext);
