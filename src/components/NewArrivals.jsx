import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Star, ShoppingBag } from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';
import ProductCard from './ProductCard';
import './NewArrivals.css';

export default function NewArrivals() {
  const { products } = useDatabase();
  const { addToCart, setIsCartOpen } = useCart();
  const sliderRef = useRef(null);

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

  const newArrivals = products.slice(0, 10);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 320;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleBuyNow = (product) => {
    addToCart(product);
    setIsCartOpen(true);
  };

  return (
    <section className="kalyan-arrivals-section" id="arrivals-section">
      <div className="arrivals-container">
        <div className="kalyan-section-header flex-header">
          <div>
            <h2 className="kalyan-section-title">
              New <span className="gold-text">Arrivals</span>
            </h2>
          </div>
          <Link 
            to="/products" 
            className="kalyan-view-all-btn"
            onClick={() => {
              sessionStorage.setItem('origin_section', 'arrivals-section');
              sessionStorage.setItem('last_scroll_pos', window.scrollY.toString());
            }}
          >
            View All Collections ›
          </Link>
        </div>

        <div className="arrivals-slider-wrapper">
          <button 
            className="arrivals-arrow arrow-l" 
            onClick={() => scroll('left')}
            aria-label="Scroll Left"
          >
            <ChevronLeft size={22} />
          </button>

          <div className="products-slider-track" ref={sliderRef}>
            {newArrivals.map((product) => (
              <div key={product.id} className="arrivals-card-wrapper">
                <ProductCard 
                  product={product} 
                  onQuickView={(p) => setQuickViewProduct(p)} 
                />
              </div>
            ))}
          </div>

          <button 
            className="arrivals-arrow arrow-r" 
            onClick={() => scroll('right')}
            aria-label="Scroll Right"
          >
            <ChevronRight size={22} />
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
