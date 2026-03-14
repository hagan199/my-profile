import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import './Contact.css';

export default function Contact() {
  const { profile } = usePortfolio();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const mailtoLink = `mailto:${profile.email}?subject=${encodeURIComponent(
      form.subject || 'Portfolio Contact'
    )}&body=${encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    )}`;
    window.location.href = mailtoLink;
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    { icon: 'fa-envelope', label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    { icon: 'fa-phone', label: 'Phone', value: profile.phone, href: `tel:${profile.phone}` },
    { icon: 'fa-map-marker', label: 'Location', value: profile.location, href: null },
  ];

  return (
    <section id="contact" className="section contact-section">
      <div className="contact-container">
        <div className="section-title">
          <h2>Get In <span>Touch</span></h2>
          <p>Have a project in mind? Let's talk about it</p>
          <span className="title-line"></span>
        </div>

        <div className="contact-content">
          {/* Info side */}
          <div className="contact-info-side">
            <h3 className="contact-info-title">Let's work together</h3>
            <p className="contact-info-desc">
              I'm currently available for freelance work and full-time positions.
              Drop me a message and I'll get back to you as soon as possible.
            </p>

            <div className="contact-info-list">
              {contactInfo.map(({ icon, label, value, href }) => (
                <div className="contact-info-item" key={label}>
                  <div className="contact-info-icon">
                    <i className={`fa ${icon}`}></i>
                  </div>
                  <div>
                    <span className="contact-info-label">{label}</span>
                    {href ? (
                      <a href={href} className="contact-info-value">{value}</a>
                    ) : (
                      <span className="contact-info-value">{value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="contact-socials">
              {profile.twitter && (
                <a href={profile.twitter} target="_blank" rel="noreferrer" aria-label="Twitter">
                  <i className="fa fa-twitter"></i>
                </a>
              )}
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  <i className="fa fa-linkedin"></i>
                </a>
              )}
              {profile.github && profile.github !== '#' && (
                <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                  <i className="fa fa-github"></i>
                </a>
              )}
              {profile.facebook && profile.facebook !== '#' && (
                <a href={profile.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                  <i className="fa fa-facebook"></i>
                </a>
              )}
            </div>
          </div>

          {/* Form side */}
          <div className="contact-form-side">
            {sent && (
              <div className="sent-banner">
                <i className="fa fa-check-circle"></i> Opening your email client...
              </div>
            )}
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Emmanuel Hagan"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Your Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="hello@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="Project discussion"
                  value={form.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  placeholder="Tell me about your project..."
                  value={form.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn highlighted-btn contact-submit">
                <i className="fa fa-paper-plane"></i> Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
