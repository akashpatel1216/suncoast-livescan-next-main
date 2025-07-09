'use client';
import React from 'react';
import './HeroSection.css';
import { motion } from 'framer-motion';
import Head from 'next/head'; // Import Head for meta tags if using Next.js

const HeroSection = () => {
  // Define your location - can be passed as props from parent component
  const location = "Tampa, Florida";
  
  return (
    <>
      {/* SEO Meta Tags - Include if using Next.js */}
      <Head>
        <title>Professional Live Scan Fingerprinting & Background Checks | Tampa, FL</title>
        <meta 
          name="description" 
          content="Secure identity verification through professional fingerprinting, background checks, and biometric services in Wesley Chapel. DOJ certified with fast results. Schedule today!" 
        />
        <meta name="keywords" content="fingerprinting services, live scan, background checks, Wesley Chapel, DOJ certified, identity verification" />
        
        {/* Optional: Open Graph tags for social sharing */}
        <meta property="og:title" content="Professional Live Scan Fingerprinting & Background Checks | Wesley Chapel, FL" />
        <meta property="og:description" content="Secure identity verification through professional fingerprinting and background checks in Wesley Chapel. DOJ certified with fast results." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourwebsite.com" />
        <meta property="og:image" content="https://yourwebsite.com/images/og-image.jpg" />
        
        {/* Optional: Local business schema */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Your Business Name",
              "image": "https://yourwebsite.com/images/logo.jpg",
              "url": "https://yourwebsite.com",
              "telephone": "+1-800-123-4567",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Your Street Address",
                "addressLocality": "Wesley Chapel",
                "addressRegion": "FL",
                "postalCode": "33544",
                "addressCountry": "US"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 28.1888,
                "longitude": -82.3531
              },
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday"
                  ],
                  "opens": "09:00",
                  "closes": "17:00"
                }
              ],
              "sameAs": [
                "https://www.facebook.com/yourbusiness",
                "https://www.instagram.com/yourbusiness"
              ]
            }
          `}
        </script>
      </Head>
      
      {/* Hero Section with SEO-friendly markup */}
      <section className="hero-section" aria-label="Fingerprinting and background check services">
        {/* Background Image Container */}
        <div className="hero-background" role="img" aria-label="Security background image"></div>
        
        {/* Optional overlay to improve text readability */}
        <div className="hero-overlay"></div>
        
        <motion.div
          className="hero-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="hero-content"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* SEO-friendly H1 tag with location keyword */}
            <h1>
              <motion.span
                className="gradient-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                Secure Identity Verification
              </motion.span>
              <br />in {location}
            </h1>
            
            {/* SEO-enhanced paragraph with keywords */}
            <p>
              Professional fingerprinting services and comprehensive background checks
              with AHCA certification. Fast, secure, and reliable identity solutions for
              employment, licensing, and legal requirements.
            </p>
            
            <div className="hero-buttons">
              <motion.a 
                href="#services" 
                className="hero-btn primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Explore Services
              </motion.a>
              <motion.a 
                href="#appointment" 
                className="hero-btn secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Schedule Appointment
              </motion.a>
            </div>
            
            <motion.div 
              className="trust-indicators"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <div className="trust-badge">
                <span className="icon secure"></span>
                <span>DOJ Certified</span>
              </div>
              <div className="trust-badge">
                <span className="icon encrypted"></span>
                <span>End-to-End Encrypted</span>
              </div>
              <div className="trust-badge">
                <span className="icon fast"></span>
                <span>Results in Minutes</span>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div
            className="hero-image"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {/* SEO-friendly image tag with descriptive alt text */}
            <img 
              src="/images/fingerprint2.png" 
              alt="Digital fingerprint scanning process for secure identity verification" 
              className="custom-hero-image" 
            />
          </motion.div>
        </motion.div>
      </section>
    </>
  );
};

export default HeroSection;