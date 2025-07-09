'use client';
import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import './About.css';

const AboutSection = () => {
  // References for scroll animations
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });
  const controls = useAnimation();
  
  // Trigger animations when section comes into view
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };
  
  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  return (
    <section className="about-section" id="about" ref={sectionRef}>
      <div className="about-background">
        <div className="about-grid-pattern"></div>
        <div className="about-blur-circle about-circle-1"></div>
        <div className="about-blur-circle about-circle-2"></div>
      </div>
      
      <div className="about-container">
        <div className="about-content-wrapper">
          <motion.div 
            className="about-image-container"
            variants={fadeInUp}
            initial="hidden"
            animate={controls}
          >
            <div className="about-image-group">
              <div className="about-image about-image-main">
                <img 
                  src="/images/about-main.png" 
                  alt="Professional fingerprinting services team" 
                  loading="lazy"
                />
              </div>
            </div>
            
          </motion.div>
          
          <motion.div 
            className="about-content"
            variants={staggerChildren}
            initial="hidden"
            animate={controls}
          >
            <motion.div variants={fadeInUp}>
              <span className="about-subtitle">About Us</span>
              <h2 className="about-title">Trusted Identity Verification Experts</h2>
            </motion.div>
            
            <motion.p className="about-description" variants={fadeInUp}>
              Our team of certified experts combines cutting-edge technology with personalized service to deliver fast, accurate results for individuals and organizations.
            </motion.p>
            
            <motion.div 
              className="about-features"
              variants={staggerChildren}
            >
              <motion.div className="about-feature" variants={fadeInUp}>
                <div className="about-feature-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div className="about-feature-content">
                  <h3>AHCA Certified</h3>
                  <p>Fully certified and authorized to provide official fingerprinting services for all agencies. Submitted directly to FDLE</p>
                </div>
              </motion.div>
              
              <motion.div className="about-feature" variants={fadeInUp}>
                <div className="about-feature-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div className="about-feature-content">
                  <h3>Fast Turnaround</h3>
                  <p>Advanced digital systems deliver quick results with same-day processing available for most services.</p>
                </div>
              </motion.div>
              
              <motion.div className="about-feature" variants={fadeInUp}>
                <div className="about-feature-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <div className="about-feature-content">
                  <h3>Customer Satisfaction</h3>
                  <p>Our expert team provides personalized service with a 100% customer satisfaction rating.</p>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="about-cta"
              variants={fadeInUp}
            >
              
              <motion.a 
                href="#contact" 
                className="about-btn primary"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Contact Us
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;