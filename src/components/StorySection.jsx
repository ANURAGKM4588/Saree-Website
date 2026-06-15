import React from 'react';
import { motion } from 'framer-motion';
import BridalSection from './BridalSection';
import './StorySection.css';

const collections = [
  {
    title: "The Banarasi Heirloom",
    origin: "Varanasi, Uttar Pradesh",
    desc: "Crafted in pure Katan silk, featuring classic floral motifs (Butidar) and heavy gold brocade borders.",
    accent: "#5C061E",
    tag: "Royal"
  },
  {
    title: "The Kanjeevaram Majesty",
    origin: "Kanchipuram, Tamil Nadu",
    desc: "Distinguished by wide contrast borders, woven with double threads (Korvai technique) depicting ancient temple architecture.",
    accent: "#A05A12",
    tag: "Temple Weave"
  },
  {
    title: "The Organza Whisper",
    origin: "Chanderi, Madhya Pradesh",
    desc: "Translucent, airy silk woven with fine silver metallic threads, decorated with hand-painted floral scrolls.",
    accent: "#4A5D4E",
    tag: "Contemporary"
  }
];

// Animation presets
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, margin: "-100px" },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

const slideInRight = {
  initial: { opacity: 0, x: -60 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: false, margin: "-100px" },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

export default function StorySection() {
  return (
    <section className="story-section">
      {/* Introduction Banner */}
      <div className="story-intro">
        <motion.span 
          className="section-tag"
          {...fadeInUp}
        >
          CURATED ARCHIVES
        </motion.span>
        <motion.h2 
          className="section-heading"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Weaving Threads of Culture
        </motion.h2>
        <motion.p 
          className="section-desc"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          Each masterpiece in our vault is selected for its cultural authenticity, 
          material integrity, and excellence in handloom craftsmanship. We partner directly 
          with award-winning master weavers across India.
        </motion.p>
      </div>

      {/* Grid Collections */}
      <div className="collections-grid">
        {collections.map((col, index) => (
          <motion.div 
            key={col.title}
            className="collection-card"
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 1, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="card-top">
              <span className="card-tag" style={{ borderColor: col.accent, color: col.accent }}>{col.tag}</span>
              <span className="card-origin">{col.origin}</span>
            </div>
            <h3 className="card-title">{col.title}</h3>
            <p className="card-desc">{col.desc}</p>
            <div className="card-glow" style={{ background: `radial-gradient(circle, ${col.accent}15 0%, transparent 70%)` }} />
          </motion.div>
        ))}
      </div>

      {/* Parallax Legacy Panel */}
      <div className="legacy-panel">
        <div className="legacy-container">
          <div className="legacy-image-col">
            <motion.div 
              className="legacy-img-wrapper"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <img 
                src={`${import.meta.env.BASE_URL || '/'}loom_detail.png`} 
                alt="Weaver handloom detail" 
                className="legacy-img" 
              />
            </motion.div>
          </div>
          
          <div className="legacy-text-col">
            <motion.span 
              className="legacy-tag"
              {...fadeInUp}
            >
              OUR HERITAGE
            </motion.span>
            <motion.h2 
              className="legacy-heading"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              Preserving a Millennia-Old Craft
            </motion.h2>
            <motion.p 
              className="legacy-paragraph"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              Handloom weaving is not just an industry; it is a sacred art passed down 
              through families of artisans. Today, mass automation threatens these 
              traditional skills. 
            </motion.p>
            <motion.p 
              className="legacy-paragraph"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              By choosing a handloom weave, you sustain an ecosystem of craftspeople, 
              honoring ancestral techniques that turn fine silk threads into precious wearable art.
            </motion.p>
          </div>
        </div>
      </div>

      <BridalSection />

      {/* Quote Banner */}
      <div className="story-quote">
        <motion.p 
          className="quote-text"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          “A saree is not merely attire. It is a canvas of heritage, draped in dignity.”
        </motion.p>
        <motion.span 
          className="quote-author"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          — Master Weaver S. Rahman
        </motion.span>
      </div>

      {/* Footer Branding (No usual buttons) */}
      <footer className="heritage-footer">
        <div className="footer-logo">ZARI</div>
        <p className="footer-copyright">© 2026 Zari Heritage Loom. All rights reserved.</p>
      </footer>
    </section>
  );
}
