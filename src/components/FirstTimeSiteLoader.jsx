import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './FirstTimeSiteLoader.css';

export default function FirstTimeSiteLoader() {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    try {
      const alreadyVisited = sessionStorage.getItem('kadha_first_visit_loaded');
      const returningToGal = sessionStorage.getItem('return_to_gallery');
      if (!alreadyVisited && returningToGal !== 'true') {
        setShowLoader(true);
        const timer = setTimeout(() => {
          setShowLoader(false);
          sessionStorage.setItem('kadha_first_visit_loaded', 'true');
        }, 1300);
        return () => clearTimeout(timer);
      } else {
        sessionStorage.setItem('kadha_first_visit_loaded', 'true');
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  if (!showLoader) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="first-time-site-loader"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="fts-loader-content">
          <motion.img
            src="/logo/logo vertical.png"
            alt="Kadha Silks Logo"
            className="fts-brand-logo"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
          <motion.div
            className="fts-gold-line"
            initial={{ width: 0 }}
            animate={{ width: '120px' }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
          <motion.p
            className="fts-tagline"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Handcrafted Pure Silk Heritage
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
