import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import './SareeGallerySection.css';

// ─── Gallery image data ────────────────────────────────────────────────────────
const galleryItems = [
  {
    id: 'gal-1',
    productId: 101,
    category: 'Bridal',
    image: '/image/saree/folded-kanjivaram-silk-saree-green-golden-pallu.webp',
  },
  {
    id: 'gal-2',
    productId: 102,
    category: 'Royal Silk',
    image: '/image/saree/5_73_7415436e-9226-4442-9a42-d47387d04730.webp',
  },
  {
    id: 'gal-3',
    productId: 103,
    category: 'Festive',
    image: '/image/saree/IMG20250515110716.jpg',
  },
  {
    id: 'gal-4',
    productId: 104,
    category: 'Classic',
    image: '/image/saree/images (5).jpeg',
  },
  {
    id: 'gal-5',
    productId: 106,
    category: 'Bridal',
    image: '/image/saree/images (7).jpeg',
  },
  {
    id: 'gal-6',
    productId: 107,
    category: 'Festive',
    image: '/image/saree/images (8).jpeg',
  },
  {
    id: 'gal-7',
    productId: 109,
    category: 'Royal Silk',
    image: '/image/saree/images (10).jpeg',
  },
  {
    id: 'gal-8',
    productId: 110,
    category: 'Classic',
    image: '/image/saree/images (11).jpeg',
  },
];

const categories = ['All Drapes', 'Bridal', 'Royal Silk', 'Festive', 'Classic'];

// ─── Pixels-per-second for the scroll (constant across all categories) ─────────
const PX_PER_SECOND = 80; // lower = slower, higher = faster
const CARD_WIDTH    = 320; // px  (must match .sg-loop-card width in CSS)
const GAP           = 20;  // px  (must match gap in CSS: 1.25rem ≈ 20px)

export default function SareeGallerySection() {
  const navigate       = useNavigate();
  const trackRef       = useRef(null);
  const [activeCategory, setActiveCategory] = useState('All Drapes');
  const [paused, setPaused]                 = useState(false);

  const filteredItems = activeCategory === 'All Drapes'
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeCategory);

  // We render 3 copies so the loop is invisible.
  // The animation must translate exactly 1/3 of the total track width.
  const itemCount      = filteredItems.length;
  const oneSetWidth    = itemCount * (CARD_WIDTH + GAP); // px for 1 copy
  const durationSec    = oneSetWidth / PX_PER_SECOND;    // consistent speed

  const handleCardClick = (productId) => {
    sessionStorage.setItem('last_scroll_pos', window.scrollY.toString());
    sessionStorage.setItem('from_gallery', 'true');
    sessionStorage.setItem('origin_section', 'saree-drape-lookbook');
    navigate(`/gallery/product/${productId}`);
  };

  return (
    <section className="saree-gallery-section" id="saree-drape-lookbook">
      <div className="sg-container">
        {/* Section Header */}
        <div className="sg-header text-center">
          <div className="sg-badge">
            <Sparkles size={14} className="sparkle-gold" />
            <span>EDITORIAL DRAPE LOOKBOOK</span>
          </div>
          <h2 className="sg-title">Saree Wearing Collection Gallery</h2>
          <p className="sg-subtitle">
            Immerse yourself in our haute couture real saree drape lookbook gallery.&nbsp;
            Click any drape photograph to explore details &amp; angles.
          </p>

          {/* Filter Tabs */}
          <div className="sg-filter-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`sg-tab-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ─── Infinite right-to-left marquee ──────────────────────────────── */}
        <div
          className="sg-loop-wrapper"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/*
           * CSS custom property --one-set-width tells the keyframe exactly how
           * far to translate (= width of ONE copy of the list).
           * This is computed in JS so it adapts to any item count.
           */}
          <div
            ref={trackRef}
            className="sg-loop-track"
            style={{
              '--one-set-width': `${oneSetWidth}px`,
              animationDuration: `${durationSec}s`,
              animationPlayState: paused ? 'paused' : 'running',
            }}
          >
            {/* Render 3 identical copies for seamless looping */}
            {[0, 1, 2].flatMap((copy) =>
              filteredItems.map((item) => (
                <motion.div
                  key={`${item.id}-copy${copy}`}
                  whileHover={{ scale: 1.04, y: -6 }}
                  whileTap={{ scale: 0.97 }}
                  className="sg-loop-card"
                  onClick={() => handleCardClick(item.productId)}
                >
                  <div className="sg-loop-img-wrapper">
                    <img
                      src={item.image}
                      alt="Saree Drape Lookbook"
                      className="sg-loop-image"
                      loading="lazy"
                    />
                    <div className="sg-loop-hover-badge">
                      <Sparkles size={13} className="sparkle-gold" />
                      <span>View Drape Look</span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
