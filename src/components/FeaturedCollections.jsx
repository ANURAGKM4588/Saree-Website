import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, X, Star, ShoppingBag } from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';
import ProductCard from './ProductCard';
import './FeaturedCollections.css';

const patternsList = [
  'Brocade',
  'Floral',
  'Zari Woven',
  'Checks',
  'Embroidery',
  'Handwork',
  'Geometric',
  'Shimmer'
];

export default function FeaturedCollections() {
  const navigate = useNavigate();
  const { products } = useDatabase();
  const { addToCart, setIsCartOpen } = useCart();
  const [selectedPattern, setSelectedPattern] = useState('Brocade');
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    if (quickViewProduct) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [quickViewProduct]);

  const filteredProducts = products
    .filter((p) => {
      if (selectedPattern === 'Brocade') return p.material?.includes('Silk') || p.weave?.includes('Zari');
      if (selectedPattern === 'Floral') return p.name.toLowerCase().includes('floral') || p.description?.toLowerCase().includes('floral');
      if (selectedPattern === 'Zari Woven') return p.weave?.includes('Zari') || p.name.toLowerCase().includes('zari');
      if (selectedPattern === 'Checks') return p.name.toLowerCase().includes('check') || p.description?.toLowerCase().includes('check');
      return p.featured || true;
    })
    .slice(0, 4);

  const handleBuyNow = (product) => {
    addToCart(product);
    setIsCartOpen(true);
  };

  return (
    <section className="kalyan-pattern-section" id="pattern-section">
      <div id="shop-by-fabric" style={{ position: 'relative', top: '-80px' }} />
      <div className="pattern-container">
        <div className="kalyan-section-header">
          <h2 className="kalyan-section-title">
            Patterns & <span className="gold-text">Weaves</span>
          </h2>
        </div>

        {/* Pattern Pills Bar */}
        <div className="pattern-pills-bar">
          {patternsList.map((pattern) => (
            <button 
              key={pattern}
              className={`pattern-pill ${selectedPattern === pattern ? 'active' : ''}`}
              onClick={() => setSelectedPattern(pattern)}
            >
              <Sparkles size={12} className="pill-sparkle" /> {pattern}
            </button>
          ))}
        </div>

        {/* Pattern Showcase Grid */}
        <div className="pattern-products-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="pattern-card-wrapper">
              <ProductCard 
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            </div>
          ))}
        </div>

        <div className="pattern-footer-cta">
          <button 
            className="kalyan-all-patterns-btn"
            onClick={() => {
              sessionStorage.setItem('origin_section', 'pattern-section');
              sessionStorage.setItem('last_scroll_pos', window.scrollY.toString());
              navigate('/products');
            }}
          >
            Explore All {selectedPattern} Sarees ›
          </button>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="quickview-modal-backdrop" onClick={() => setQuickViewProduct(null)}>
          <div className="quickview-modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="quickview-close-btn" onClick={() => setQuickViewProduct(null)}>
              <X size={22} />
            </button>
            <div className="quickview-grid">
              <motion.div 
                className="qv-image-side"
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <img src={quickViewProduct.image} alt={quickViewProduct.name} className="qv-img" />
              </motion.div>
              <motion.div 
                className="qv-details-side"
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="qv-brand">AUTHENTIC KADHA SILKS</span>
                <h2 className="qv-title">{quickViewProduct.name}</h2>
                <div className="qv-rating">
                  <Star size={14} fill="#c89d36" color="#c89d36" />
                  <Star size={14} fill="#c89d36" color="#c89d36" />
                  <Star size={14} fill="#c89d36" color="#c89d36" />
                  <Star size={14} fill="#c89d36" color="#c89d36" />
                  <Star size={14} fill="#c89d36" color="#c89d36" />
                  <span>(4.9 / 5.0)</span>
                </div>
                <div className="qv-price-block">
                  <span className="qv-price">{formatPrice(quickViewProduct.price)}</span>
                  {quickViewProduct.originalPrice && (
                    <span className="qv-orig">{formatPrice(quickViewProduct.originalPrice)}</span>
                  )}
                </div>
                <p className="qv-description">
                  {quickViewProduct.description || 'Crafted on traditional looms with pure silk filaments and intricate metallic zari borders. Includes matching unstitched blouse piece.'}
                </p>
                <div className="qv-specs">
                  <div><strong>Fabric:</strong> {quickViewProduct.material || 'Pure Silk'}</div>
                  <div><strong>Craft:</strong> {quickViewProduct.weave || 'Handloom Zari'}</div>
                  <div><strong>Dispatch:</strong> Express (2-4 Business Days)</div>
                </div>
                <div className="qv-actions">
                  <button 
                    className="qv-add-btn"
                    onClick={() => {
                      addToCart(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                  >
                    <ShoppingBag size={16} /> Add to Cart
                  </button>
                  <button 
                    className="qv-buy-btn"
                    onClick={() => {
                      handleBuyNow(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                  >
                    Buy Now
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
