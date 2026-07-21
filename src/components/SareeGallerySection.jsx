import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight, Sparkles, Eye, Heart } from 'lucide-react';
import { formatPrice } from '../data/products';
import { useCart } from '../context/CartContext';
import './SareeGallerySection.css';

// Curated drape lookbook collection mapped to distinct real saree products
const galleryItems = [
  {
    id: 'gal-1',
    productId: 101,
    title: 'Kanchipuram Divine Lotus',
    category: 'Bridal',
    price: 1,
    originalPrice: 62000,
    image: '/image/saree/folded-kanjivaram-silk-saree-green-golden-pallu.webp',
    drapeType: 'Traditional South Indian Drape',
    occasion: 'Wedding & Bridal'
  },
  {
    id: 'gal-2',
    productId: 102,
    title: 'Banarasi Royal Velvet',
    category: 'Royal Silk',
    price: 52900,
    originalPrice: 68000,
    image: '/image/saree/5_73_7415436e-9226-4442-9a42-d47387d04730.webp',
    drapeType: 'North Indian Bridal Drape',
    occasion: 'Grand Reception'
  },
  {
    id: 'gal-3',
    productId: 103,
    title: 'Organza Floral Dream',
    category: 'Festive',
    price: 1,
    originalPrice: 38500,
    image: '/image/saree/IMG20250515110716.jpg',
    drapeType: 'Airy Pastel Pleated Drape',
    occasion: 'Daytime Celebrations'
  },
  {
    id: 'gal-4',
    productId: 104,
    title: 'Patola Heritage Weave',
    category: 'Classic',
    price: 72500,
    originalPrice: 92000,
    image: '/image/saree/images (5).jpeg',
    drapeType: 'Double Ikat Royal Drape',
    occasion: 'Heritage Gathering'
  },
  {
    id: 'gal-5',
    productId: 106,
    title: 'Kanjeevaram Temple Rich',
    category: 'Bridal',
    price: 89500,
    originalPrice: 115000,
    image: '/image/saree/images (7).jpeg',
    drapeType: 'Grand Temple Korvai Drape',
    occasion: 'Muhurtham Ceremony'
  },
  {
    id: 'gal-6',
    productId: 107,
    title: 'Banarasi Tissue Gold',
    category: 'Festive',
    price: 62500,
    originalPrice: 78000,
    image: '/image/saree/images (8).jpeg',
    drapeType: 'Metallic Sheen Pallu Drape',
    occasion: 'Sangeet & Evening'
  },
  {
    id: 'gal-7',
    productId: 109,
    title: 'Paithani Peacock Glory',
    category: 'Royal Silk',
    price: 78500,
    originalPrice: 95000,
    image: '/image/saree/images (10).jpeg',
    drapeType: 'Maharashtrian Nauvari Style Drape',
    occasion: 'Traditional Pooja'
  },
  {
    id: 'gal-8',
    productId: 110,
    title: 'Tussar Silk Tribal',
    category: 'Classic',
    price: 26500,
    originalPrice: 33000,
    image: '/image/saree/images (11).jpeg',
    drapeType: 'Natural Handloom Textured Drape',
    occasion: 'Festive Gathering'
  }
];

const categories = ['All Drapes', 'Bridal', 'Royal Silk', 'Festive', 'Classic'];

export default function SareeGallerySection() {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist } = useCart();
  const [activeCategory, setActiveCategory] = useState('All Drapes');

  const filteredItems = activeCategory === 'All Drapes'
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeCategory);

  const handleCardClick = (productId) => {
    sessionStorage.setItem('last_scroll_pos', window.scrollY.toString());
    sessionStorage.setItem('from_gallery', 'true');
    navigate(`/gallery/product/${productId}`);
  };

  return (
    <section className="saree-gallery-section" id="saree-drape-lookbook">
      <div className="sg-container">
        {/* Section Header */}
        <div className="sg-header text-center">
          <div className="sg-badge">
            <Sparkles size={14} className="sparkle-gold" />
            <span>REAL DRAPE LOOKBOOK</span>
          </div>
          <h2 className="sg-title">Saree Wearing Collection Gallery</h2>
          <p className="sg-subtitle">
            Explore how our handcrafted pure silk drapes look in real life. Click on any drape image to open the complete saree details & buy directly.
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

        {/* Gallery Grid */}
        <motion.div layout className="sg-grid">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => {
              const isLiked = wishlist.includes(item.productId);

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 15 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="sg-card"
                  onClick={() => handleCardClick(item.productId)}
                >
                  <div className="sg-image-wrapper">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="sg-image"
                      loading="lazy"
                    />

                    {/* Top Badges */}
                    <div className="sg-card-top-bar">
                      <span className="sg-occasion-badge">{item.occasion}</span>
                      <button
                        type="button"
                        className={`sg-wish-btn ${isLiked ? 'liked' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(item.productId);
                        }}
                        title={isLiked ? 'Remove from Wishlist' : 'Add to Wishlist'}
                      >
                        <Heart size={16} fill={isLiked ? '#dc2626' : 'none'} color={isLiked ? '#dc2626' : '#ffffff'} />
                      </button>
                    </div>

                    {/* Hover Overlay */}
                    <div className="sg-overlay">
                      <div className="sg-overlay-content">
                        <span className="sg-drape-type">{item.drapeType}</span>
                        <h3 className="sg-item-name">{item.title}</h3>

                        <div className="sg-price-row">
                          <span className="sg-price">{formatPrice(item.price)}</span>
                          {item.originalPrice && (
                            <span className="sg-orig-price">{formatPrice(item.originalPrice)}</span>
                          )}
                        </div>

                        <button type="button" className="sg-buy-access-btn">
                          <span>View Details & Buy Saree</span>
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Bottom Quick Indicator */}
                    <div className="sg-bottom-indicator">
                      <Eye size={14} /> Click to View & Buy
                    </div>
                  </div>

                  <div className="sg-card-meta-bar">
                    <h4 className="sg-meta-title">{item.title}</h4>
                    <span className="sg-meta-price">{formatPrice(item.price)}</span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
