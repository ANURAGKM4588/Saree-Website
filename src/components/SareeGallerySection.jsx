import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight, Sparkles, Eye, Heart } from 'lucide-react';
import { formatPrice } from '../data/products';
import { useCart } from '../context/CartContext';
import './SareeGallerySection.css';

// Curated drape lookbook collection with editorial collage spans
const galleryItems = [
  {
    id: 'gal-1',
    productId: 101,
    category: 'Bridal',
    image: '/image/saree/folded-kanjivaram-silk-saree-green-golden-pallu.webp',
    spanClass: 'collage-tall'
  },
  {
    id: 'gal-2',
    productId: 102,
    category: 'Royal Silk',
    image: '/image/saree/5_73_7415436e-9226-4442-9a42-d47387d04730.webp',
    spanClass: 'collage-wide'
  },
  {
    id: 'gal-3',
    productId: 103,
    category: 'Festive',
    image: '/image/saree/IMG20250515110716.jpg',
    spanClass: 'collage-normal'
  },
  {
    id: 'gal-4',
    productId: 104,
    category: 'Classic',
    image: '/image/saree/images (5).jpeg',
    spanClass: 'collage-normal'
  },
  {
    id: 'gal-5',
    productId: 106,
    category: 'Bridal',
    image: '/image/saree/images (7).jpeg',
    spanClass: 'collage-large'
  },
  {
    id: 'gal-6',
    productId: 107,
    category: 'Festive',
    image: '/image/saree/images (8).jpeg',
    spanClass: 'collage-tall'
  },
  {
    id: 'gal-7',
    productId: 109,
    category: 'Royal Silk',
    image: '/image/saree/images (10).jpeg',
    spanClass: 'collage-normal'
  },
  {
    id: 'gal-8',
    productId: 110,
    category: 'Classic',
    image: '/image/saree/images (11).jpeg',
    spanClass: 'collage-wide'
  }
];

const categories = ['All Drapes', 'Bridal', 'Royal Silk', 'Festive', 'Classic'];

export default function SareeGallerySection() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All Drapes');

  const filteredItems = activeCategory === 'All Drapes'
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeCategory);

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
            Immerse yourself in our haute couture real saree drape lookbook gallery. Click any drape photograph to explore details & angles.
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

        {/* Pure Image Editorial Collage Grid with Framer Motion */}
        <motion.div layout className="sg-collage-grid">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.88, y: 25 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.88, y: 15 }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.04,
                  ease: [0.16, 1, 0.3, 1],
                  layout: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
                }}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className={`sg-collage-card ${item.spanClass}`}
                onClick={() => handleCardClick(item.productId)}
              >
                <div className="sg-collage-img-wrapper">
                  <img
                    src={item.image}
                    alt="Saree Drape Lookbook"
                    className="sg-collage-image"
                    loading="lazy"
                  />
                  <div className="sg-collage-hover-badge">
                    <Sparkles size={14} className="sparkle-gold" />
                    <span>View Drape Look</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
