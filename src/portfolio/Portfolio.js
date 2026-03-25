import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Hero from '../components/Hero/Hero';
import About from '../components/About/About';
import Skills from '../components/Skills/Skills';
import Projects from '../components/Projects/Projects';
import Contact from '../components/Contact/Contact';
import Footer from '../components/Footer/Footer';

export default function Portfolio() {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTopBtn(window.scrollY > 500);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Navbar />
      <Hero />
      <div className="reveal-on-scroll"><About /></div>
      <div className="reveal-on-scroll"><Skills /></div>
      <div className="reveal-on-scroll"><Projects /></div>
      <div className="reveal-on-scroll"><Contact /></div>
      <Footer />

      <button
        className={`back-to-top${showTopBtn ? ' visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <i className="fa fa-chevron-up"></i>
      </button>
    </>
  );
}
