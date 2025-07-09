'use client';
import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import './Solutions.css';

// SVG Icons for services
const icons = {
  fingerprint: (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2s8 3 8 10v3.5C20 19 16.42 21 12 21s-8-2-8-5.5V12c0-7 8-10 8-10z"></path>
    </svg>
  ),
  shield: (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
  ),
  id: (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2"></rect>
      <circle cx="9" cy="10" r="2"></circle>
      <path d="M15 8h2"></path>
      <path d="M15 12h2"></path>
      <path d="M7 16h10"></path>
    </svg>
  )
};

const SolutionsSection = () => {
  // Reference to section for intersection observer
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const controls = useAnimation();
  
  // Animation when section comes into view
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  // Services data - removed document processing
  const services = [
    {
      id: 'livescan',
      icon: 'fingerprint',
      title: 'LiveScan Fingerprinting',
      description: 'State-of-the-art digital fingerprinting with direct submission to DOJ and FBI databases.',
      features: ['Fast processing', 'High-quality capture', 'Secure transmission', 'Full compliance'],
      color: '#3b82f6'
    },
    {
      id: 'background',
      icon: 'shield',
      title: 'Background Checks',
      description: 'Comprehensive background screening services for employment, licensing, and certification.',
      features: ['Criminal history', 'Employment verification', 'Education verification', 'Identity confirmation'],
      color: '#0f172a'
    },
    {
      id: 'identity',
      icon: 'id',
      title: 'Identity Verification',
      description: 'Multi-factor biometric identity verification for high-security requirements.',
      features: ['Facial recognition', 'Document verification', 'Liveness detection', 'Anti-fraud measures'],
      color: '#4f46e5'
    }
  ];

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
        duration: 0.6
      }
    }
  };

  return (
    <section className="solutions-section" id="solutions" ref={ref}>
      <div className="solutions-background">
        <div className="grid-pattern"></div>
        <div className="blur-circle circle-1"></div>
        <div className="blur-circle circle-2"></div>
      </div>
      
      <div className="solutions-container">
        <motion.div 
          className="solutions-header"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2>Our Solutions</h2>
          <p>Comprehensive identity verification and background screening services to meet your specific needs</p>
        </motion.div>
        
        <motion.div 
          className="solutions-grid three-cards" // Added class for 3-card grid
          variants={sectionVariants}
          initial="hidden"
          animate={controls}
        >
          {services.map((service, index) => (
            <motion.div 
              className="solution-card"
              key={service.id}
              variants={cardVariants}
              whileHover={{ 
                y: -10, 
                boxShadow: '0 20px 30px rgba(0, 0, 0, 0.12)'
              }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="solution-icon" style={{ color: service.color }}>
                {icons[service.icon]}
                <div className="icon-background" style={{ backgroundColor: `${service.color}10` }}></div>
              </div>
              
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              
              <ul className="solution-features">
                {service.features.map((feature, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                    transition={{ delay: 0.6 + (idx * 0.1) + (index * 0.1) }}
                  >
                    <span className="feature-dot" style={{ backgroundColor: service.color }}></span>
                    {feature}
                  </motion.li>
                ))}
              </ul>
              
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="solutions-cta"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
        >
          <div className="cta-content">
            <h3>Ready to get started?</h3>
            <p>Schedule your appointment today and experience our professional, efficient service.</p>
          </div>
          
          <motion.button 
            className="cta-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            Book Appointment
          </motion.button>
        </motion.div>
      </div>
      
      <div className="curve-divider">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,0 C720,120 1440,0 1440,0 L1440,120 L0,120 Z" fill="white"></path>
        </svg>
      </div>
    </section>
  );
};

export default SolutionsSection;