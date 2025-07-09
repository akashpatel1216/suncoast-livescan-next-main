'use client';
import React from 'react';
import { motion } from 'framer-motion';
import './Footer.css';

const FooterSection = () => {
  // Get current year for copyright
  const currentYear = new Date().getFullYear();
  
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: "easeOut" 
      }
    }
  };
  
  // Handle newsletter subscription
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Here you would implement actual newsletter subscription logic
    alert('Thank you for subscribing to our newsletter!');
    e.target.reset();
  };

  return (
    <footer className="footer-section">
      <div className="footer-background">
        <div className="footer-waves">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="#f8fafc" fillOpacity="1" d="M0,128L80,138.7C160,149,320,171,480,186.7C640,203,800,213,960,202.7C1120,192,1280,160,1360,144L1440,128L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path>
          </svg>
        </div>
      </div>
      
      <div className="footer-main">
        <div className="footer-container">
          <div className="footer-top">
            <div className="footer-logo-section">
              <div className="footer-logo">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2s8 3 8 10v3.5C20 19 16.42 21 12 21s-8-2-8-5.5V12c0-7 8-10 8-10z" fill="#3b82f6" fillOpacity="0.2" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 11c1.5 0 3 .5 3 2-2 3-4 3-6 3" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 11c0-1 .6-3 3-3 1.5 0 3 .5 3 2" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Suncoast Livescan</span>
              </div>
              <p className="footer-tagline">Your trusted partner for fingerprinting and background check services.</p>
              
              <div className="footer-social">
                <motion.a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Facebook"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </motion.a>
                
                <motion.a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Twitter"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </motion.a>
                
                <motion.a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="LinkedIn"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </motion.a>
                
                <motion.a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Instagram"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </motion.a>
              </div>
            </div>
            
            <div className="footer-links-wrapper">
              <div className="footer-links-column">
                <h3>Services</h3>
                <ul>
                  <li><a href="#livescan">LiveScan Fingerprinting</a></li>
                  <li><a href="#background">Background Checks</a></li>
                  <li><a href="#identity">Identity Verification</a></li>
                  <li><a href="#pricing">Pricing</a></li>
                </ul>
              </div>
              
              <div className="footer-links-column">
                <h3>Company</h3>
                <ul>
                  <li><a href="#about">About Us</a></li>
                </ul>
              </div>
              
              <div className="footer-links-column">
                <h3>Resources</h3>
                <ul>
                  <li><a href="#support">Support</a></li>
                  <li><a href="#contact">Contact Us</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <div className="footer-legal">
              <p>&copy; {currentYear} Suncoast Livescan. All rights reserved.</p>
              <div className="footer-legal-links">
                <a href="#privacy">Privacy Policy</a>
                <a href="#terms">Terms of Service</a>
                <a href="#accessibility">Accessibility</a>
                <a href="#sitemap">Sitemap</a>
              </div>
            </div>
            
            <motion.div 
              className="footer-developer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <div className="developer-badge">
                <div className="developer-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                  </svg>
                </div>
                <div className="developer-info">
                  <span className="developer-label">Developed by</span>
                  <div className="developer-details">
                    <span className="developer-name">Akash Patel</span>
                    <motion.a 
                      href="mailto:akashp1412@gmail.com"
                      className="developer-email"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      akashp1412@gmail.com
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <div className="footer-certifications">
            </div>
          </div>
        </div>
      </div>
      
      <motion.div 
        className="scroll-to-top"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Scroll to top"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </motion.div>
    </footer>
  );
};

export default FooterSection;