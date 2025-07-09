'use client';
import React, { useState, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import './ContactForm.css';

const ContactSection = () => {
  // Form state management
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    error: false,
    message: ''
  });
  
  // Intersection observer for animations
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });
  const controls = useAnimation();
  
  // Animation when section comes into view
  React.useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create mailto link with form information
    const recipientEmail = 'info@suncoastlivescan.net';
    const subject = `Service Request: ${formState.service}`;
    const body = `
Name: ${formState.name}
Email: ${formState.email}
Phone: ${formState.phone}
Service Needed: ${formState.service}

Message:
${formState.message}
    `;
    
    // Encode for mailto URL
    const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Show success message
    setFormStatus({
      submitted: true,
      error: false,
      message: 'Opening your email client. Please send the email to complete your request.'
    });
    
    // Reset success message after 5 seconds
    setTimeout(() => {
      setFormStatus({
        submitted: false,
        error: false,
        message: ''
      });
    }, 5000);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <section className="contact-section" id="contact" ref={sectionRef}>
      <div className="contact-background">
        <div className="contact-grid-pattern"></div>
        <div className="contact-blur-circle contact-circle-1"></div>
        <div className="contact-blur-circle contact-circle-2"></div>
      </div>
      
      <div className="contact-container">
        <motion.div
          className="contact-header"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2>Get In Touch</h2>
          <p>Schedule your appointment or request more information about our fingerprinting and background check services</p>
        </motion.div>
        
        <div className="contact-content">
          <motion.div
            className="contact-info"
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            <motion.div className="contact-info-card" variants={itemVariants}>
              <div className="contact-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <h3>Phone</h3>
              <a href="tel:+18136185227">(813)-618-5227</a>
              <p>Monday-Friday: 9AM-5PM</p>
            </motion.div>
            
            <motion.div className="contact-info-card" variants={itemVariants}>
              <div className="contact-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <h3>Email</h3>
              <a href="mailto:info@suncoastlivescan.net">info@suncoastlivescan.net</a>
              <p>We'll respond within 24 hours</p>
            </motion.div>
            
            <motion.div className="contact-info-card" variants={itemVariants}>
              <div className="contact-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <h3>Location</h3>
              <address>2901 W Busch Blvd, Unit 206<br />Tampa, FL 33618</address>
              <p>Free parking available</p>
            </motion.div>
          </motion.div>
          
          <motion.div
            className="contact-form-container"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            <div className="form-card">
              <h3>Send us a message</h3>
              
              {formStatus.message && (
                <div className={`form-message ${formStatus.error ? 'error' : formStatus.submitted ? 'success' : 'sending'}`}>
                  {formStatus.submitted ? (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  ) : formStatus.error ? (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="15" y1="9" x2="9" y2="15"></line>
                      <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                  ) : (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  )}
                  <p>{formStatus.message}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Your name"
                    value={formState.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Your email"
                      value={formState.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="Your phone"
                      value={formState.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="service">Service Needed</label>
                  <select
                    id="service"
                    name="service"
                    value={formState.service}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled>Select a service</option>
                    <option value="LiveScan Fingerprinting">LiveScan Fingerprinting</option>
                    <option value="Background Checks">Background Checks</option>
                    <option value="Mobile Fingerprinting">Mobile Fingerprinting</option>
                    <option value="Other Services">Other Services</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="How can we help you?"
                    rows="4"
                    value={formState.message}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
                
                <motion.button
                  type="submit"
                  className="submit-button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Send Message
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Map Section */}
      <div className="contact-map-section">
        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7318.347977835719!2d-82.49451472429217!3d28.03635487599557!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88c2c124a60e2ed9%3A0x9e35563deb5bcf73!2sARCpoint%20Labs%20of%20North%20Tampa!5e1!3m2!1sen!2sus!4v1745123867916!5m2!1sen!2sus"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Our Location"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;