
"use client";
import React, { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('home');

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle active link based on scroll position
  useEffect(() => {
    const handleActiveLink = () => {
      const sections = ['home', 'solutions', 'about', 'testimonials', 'contact'];
      
      const scrollPosition = window.scrollY + 100;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveLink(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleActiveLink);
    return () => window.removeEventListener('scroll', handleActiveLink);
  }, []);

  // Close mobile menu when a link is clicked
  const handleLinkClick = (link) => {
    setActiveLink(link);
    setIsMenuOpen(false);
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="logo">
          <img src="/logo.svg" alt="Logo" className="logo-img" />
        </div>

        <div
          className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <a 
            href="#home" 
            className={`nav-item ${activeLink === 'home' ? 'active' : ''}`}
            onClick={() => handleLinkClick('home')}
          >
            Home
          </a>
          <a 
            href="#solutions" 
            className={`nav-item ${activeLink === 'solutions' ? 'active' : ''}`}
            onClick={() => handleLinkClick('solutions')}
          >
            Solutions
          </a>
          <a 
            href="#about" 
            className={`nav-item ${activeLink === 'about' ? 'active' : ''}`}
            onClick={() => handleLinkClick('about')}
          >
            About
          </a>
          <a 
            href="#contact" 
            className={`nav-item ${activeLink === 'contact' ? 'active' : ''}`}
            onClick={() => handleLinkClick('contact')}
          >
            Contact
          </a>
        </nav>

        <button className="cta-button">
          Get Started
          <i className="cta-icon">→</i>
        </button>
      </div>
    </header>
  );
};

export default Navbar;

