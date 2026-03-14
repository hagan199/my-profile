import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import './admin.css';

export default function AdminLogin() {
  const { adminLogin, isAdminLoggedIn } = usePortfolio();
  const navigate = useHistory();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdminLoggedIn) navigate.push('/admin');
  }, [isAdminLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise((r) => setTimeout(r, 600)); // brief UX delay
    const ok = adminLogin(password);
    setLoading(false);
    if (ok) {
      navigate.push('/admin');
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <span className="logo-bracket">&lt;</span>EH<span className="logo-bracket">/&gt;</span>
        </div>
        <h1 className="admin-login-title">Admin Panel</h1>
        <p className="admin-login-sub">Sign in to manage your portfolio</p>

        {error && (
          <div className="admin-alert admin-alert-error">
            <i className="fa fa-exclamation-circle"></i> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-form-group">
            <label>Password</label>
            <div className="admin-input-wrapper">
              <i className="fa fa-lock admin-input-icon"></i>
              <input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>

          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? (
              <><i className="fa fa-spinner fa-spin"></i> Signing in...</>
            ) : (
              <><i className="fa fa-sign-in"></i> Sign In</>
            )}
          </button>
        </form>

        <div className="admin-login-hint">
          <i className="fa fa-info-circle"></i>
          <span>Default password: <code>admin@hagan2024</code></span>
        </div>

        <a href="/" className="admin-back-link">
          <i className="fa fa-arrow-left"></i> Back to Portfolio
        </a>
      </div>
    </div>
  );
}
