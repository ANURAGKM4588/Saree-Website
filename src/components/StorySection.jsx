import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Award, Users, Clock, ShieldCheck, Gem, Package, Feather } from 'lucide-react';
import './StorySection.css';

const BASE = import.meta.env.BASE_URL || '/';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
};

export default function StorySection() {
  return (
    <section className="story-section" id="story-section">
      <div id="story" style={{ position: 'relative', top: '-100px' }} />

      <div className="story-wrapper">
        <div className="story-container">

          {/* Top Header */}
          <div className="story-header-center">
            <motion.div className="story-badge" {...fadeInUp}>
              <Sparkles size={14} className="gold-sparkle" />
              <span>OUR EMOTIONAL STORY • CENTURY OF DEVOTION</span>
            </motion.div>
            
            <motion.h2 
              className="story-main-heading"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              Where Every Thread Carries<br />a Mother's Blessing
            </motion.h2>

            <motion.div 
              className="story-divider-line"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </div>

          {/* Grid Layout: Image + Deep Story Text */}
          <div className="story-grid">
            <div className="story-image-col">
              <motion.div 
                className="story-img-frame-wrapper"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="story-img-gold-border-decor" />
                <div className="story-img-frame">
                  <img 
                    src={`${BASE}loom_detail.png`} 
                    alt="Authentic Handloom Silk Weaving" 
                    className="story-img"
                  />
                  <div className="story-img-overlay" />
                  <div className="story-floating-badge">
                    <Heart size={18} fill="#ef4444" color="#ef4444" />
                    <div>
                      <strong>Woven with Love</strong>
                      <span>100% Handloom Authentic Silk</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="story-content-col">
              <motion.p 
                className="story-paragraph highlight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                For over a century, KADHA has been more than a weaver of silk — we are guardians of priceless human emotions. A saree is never just a piece of fabric; it is a sacred inheritance passed from a mother's loving hands to her daughter on her wedding day, wrapping her in warmth, blessings, and timeless dignity.
              </motion.p>

              <motion.p 
                className="story-paragraph"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                Deep in the quiet looms of Varanasi, Kanchipuram, and Chettinad, our master weavers wake before dawn. With rhythm, devotion, and soul, they interweave pure silk threads with real gold zari. Every single fold carries hundreds of hours of patient artisan dedication — transforming raw silk into living heritage.
              </motion.p>

              <motion.p 
                className="story-paragraph"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                When you drape a KADHA silk saree, you aren't just wearing an outfit — you are carrying the memories of your ancestors, celebrating your present elegance, and crafting a legacy for generations yet to come.
              </motion.p>

              {/* Stats Highlights */}
              <motion.div 
                className="story-stats-grid"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.5 }}
              >
                <div className="story-stat-card">
                  <Users size={22} className="stat-icon" />
                  <h4>4 Generations</h4>
                  <p>Artisan Lineage</p>
                </div>
                <div className="story-stat-card">
                  <Clock size={22} className="stat-icon" />
                  <h4>180+ Hours</h4>
                  <p>Handcrafting Each Piece</p>
                </div>
                <div className="story-stat-card">
                  <Award size={22} className="stat-icon" />
                  <h4>100% Pure</h4>
                  <p>Silk Mark Certified</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Heritage Promise Cards Bar */}
          <motion.div 
            className="story-promise-grid"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="story-promise-item">
              <Feather size={22} className="promise-icon" />
              <div>
                <h5>Pure Handloom Weave</h5>
                <p>Authentic mulberry silk threads</p>
              </div>
            </div>
            <div className="story-promise-item">
              <Gem size={22} className="promise-icon" />
              <div>
                <h5>Pure Zari Embroidery</h5>
                <p>Tested for genuine zari luster</p>
              </div>
            </div>
            <div className="story-promise-item">
              <Package size={22} className="promise-icon" />
              <div>
                <h5>Royal Heirloom Box</h5>
                <p>Keepsake velvet packaging</p>
              </div>
            </div>
            <div className="story-promise-item">
              <ShieldCheck size={22} className="promise-icon" />
              <div>
                <h5>Government Certified</h5>
                <p>Guaranteed Silk Mark purity</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
