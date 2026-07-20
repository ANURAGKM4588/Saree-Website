import React, { useState, useLayoutEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Shield, Truck, RotateCcw, CheckCircle2, ThumbsUp, MessageSquarePlus, Quote } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';
import { useDatabase } from '../context/DatabaseContext';
import './ProductDetailPage.css';

const sampleReviewsList = [
  {
    id: 1,
    author: 'Sunita Reddy',
    location: 'Hyderabad, India',
    rating: 5,
    date: '12 June 2026',
    verified: true,
    title: 'Exquisite Silk & Royal Finish!',
    comment: 'The saree is absolutely breathtaking! Pure silk feel with heavy zari border that gleams under wedding lights. Received so many compliments. Packaging was super premium too.',
    image: '/image/saree/Folded_pure_kanjivaram_silk_saree_crimson_red_gold_zari.webp'
  },
  {
    id: 2,
    author: 'Dr. Meera Menon',
    location: 'Bangalore, India',
    rating: 5,
    date: '28 May 2026',
    verified: true,
    title: 'Authentic Traditional Craft',
    comment: 'I ordered this for my sister’s engagement. The color matching and pallu embroidery are identical to what was shown in video shopping. Highly recommend KADHA Silks!',
    image: '/image/saree/folded-kanjivaram-silk-saree-green-golden-pallu.webp'
  },
  {
    id: 3,
    author: 'Ananya Nair',
    location: 'Kochi, Kerala',
    rating: 5,
    date: '10 April 2026',
    verified: true,
    title: 'Pure Perfection & Super Comfort',
    comment: 'The drape is incredibly soft and easy to carry for long hours. Includes a matching unstitched blouse piece. Express delivery arrived in just 2 days!',
    image: '/image/saree/Katan_silk_saree_yellow_gold_zari.webp'
  }
];

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();
  const { getProductById, loading } = useDatabase();
  const product = getProductById(id);

  const [helpfulCounts, setHelpfulCounts] = useState({ 1: 24, 2: 18, 3: 15 });

  // Synchronous zero-scroll-animation positioning before screen paint
  useLayoutEffect(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="pdp-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div style={{ color: 'var(--color-gold)', fontSize: '1.2rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div className="spinner" style={{
            width: '24px',
            height: '24px',
            border: '2px solid var(--color-gold)',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          Loading Saree Details...
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pdp-not-found">
        <h2>Saree not found</h2>
        <Link to="/products">Browse all sarees</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    addToCart(product);
    setIsCartOpen(true);
  };

  const handleHelpfulClick = (revId) => {
    setHelpfulCounts((prev) => ({
      ...prev,
      [revId]: (prev[revId] || 0) + 1
    }));
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  // Clean horizontal animation variants
  const slideFromLeft = {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.45, ease: [0.25, 1, 0.5, 1] }
  };

  const slideFromRight = {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.45, ease: [0.25, 1, 0.5, 1] }
  };

  return (
    <div className="pdp-page" key={product.id}>
      <div className="pdp-container">
        {/* Clean Breadcrumb Path Navigation without Back Icon */}
        <div className="pdp-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products" className="pdp-breadcrumb-link">
            All Sarees
          </Link>
          <span>/</span>
          <span className="pdp-current">{product.name}</span>
        </div>

        {/* Top Product Main Grid */}
        <div className="pdp-layout">
          {/* Product Image: Clean Horizontal Slide from LEFT to RIGHT with Fade */}
          <motion.div
            key={`img-${product.id}`}
            className="pdp-image-col"
            initial={slideFromLeft.initial}
            animate={slideFromLeft.animate}
            transition={slideFromLeft.transition}
          >
            <div className="pdp-image-wrapper">
              {product.tag && <div className="pdp-tag">{product.tag}</div>}
              {discount > 0 && <div className="pdp-discount">-{discount}%</div>}
              <img src={product.image} alt={product.name} className="pdp-image" />
            </div>
          </motion.div>

          {/* Product Details: Clean Horizontal Slide from RIGHT to LEFT with Fade */}
          <motion.div
            key={`text-${product.id}`}
            className="pdp-details-col"
            initial={slideFromRight.initial}
            animate={slideFromRight.animate}
            transition={slideFromRight.transition}
          >
            <span className="pdp-material">{product.material || 'Authentic Silk'}</span>
            <h1 className="pdp-name">{product.name}</h1>

            <div className="pdp-rating">
              <div className="pdp-stars">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={16}
                    fill={s <= Math.round(product.rating || 5) ? '#EDF4C1' : 'none'}
                    color="#EDF4C1"
                  />
                ))}
              </div>
              <span className="pdp-rating-text">
                {product.rating || 4.9} ({product.reviews || 89} customer reviews)
              </span>
            </div>

            <div className="pdp-pricing">
              <span className="pdp-current-price">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="pdp-original-price">{formatPrice(product.originalPrice)}</span>
                  <span className="pdp-save">Save {formatPrice(product.originalPrice - product.price)}</span>
                </>
              )}
            </div>

            <p className="pdp-tax">Inclusive of all taxes & free express shipping</p>

            <p className="pdp-description">{product.description || 'Luxurious authentic silk handwoven with traditional precision. Features detailed zari borders and rich texture.'}</p>

            <div className="pdp-category-row">
              <span className="pdp-category-label">Category:</span>
              <span className="pdp-category-value">{product.category}</span>
            </div>

            <div className="pdp-stock-row">
              <span className={`pdp-stock-dot ${product.inStock ? 'in' : 'out'}`} />
              <span>{product.inStock ? 'In Stock — Ready for Express Dispatch' : 'Currently Out of Stock'}</span>
              {product.comingSoon && <span className="pdp-coming-tag">Coming Soon</span>}
            </div>

            {/* Action Buttons */}
            <div className="pdp-actions">
              <button
                className="pdp-add-cart"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingBag size={18} /> Add to Bag
              </button>
              <button
                className="pdp-buy-now"
                onClick={handleBuyNow}
                disabled={!product.inStock}
              >
                Buy Now
              </button>
            </div>

            <div className="pdp-features">
              <div className="pdp-feature">
                <Truck size={16} />
                <span>Free express shipping worldwide</span>
              </div>
              <div className="pdp-feature">
                <Shield size={16} />
                <span>100% Silk Mark certified authenticity guaranteed</span>
              </div>
              <div className="pdp-feature">
                <RotateCcw size={16} />
                <span>15-day easy returns & doorstep exchange</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Clean Listing Section: Specifications & Customer Reviews Stacked */}
        <div className="pdp-listing-container">
          {/* Section 1: Product Specifications List */}
          <motion.div 
            className="listing-section"
            initial={slideFromLeft.initial}
            animate={slideFromLeft.animate}
            transition={slideFromLeft.transition}
          >
            <h2 className="listing-section-title">Product Specifications</h2>
            <div className="specs-list">
              <div className="spec-item-row">
                <span className="spec-label">Fabric Material</span>
                <span className="spec-val">{product.material || 'Pure Kanjivaram Silk'}</span>
              </div>
              <div className="spec-item-row">
                <span className="spec-label">Weave Craft</span>
                <span className="spec-val">{product.weave || 'Traditional Handloom Zari'}</span>
              </div>
              <div className="spec-item-row">
                <span className="spec-label">Saree Length</span>
                <span className="spec-val">5.5 Meters</span>
              </div>
              <div className="spec-item-row">
                <span className="spec-label">Blouse Piece</span>
                <span className="spec-val">0.8 Meter Unstitched (Included)</span>
              </div>
              <div className="spec-item-row">
                <span className="spec-label">Authenticity</span>
                <span className="spec-val">Silk Mark Certified 100% Genuine</span>
              </div>
              <div className="spec-item-row">
                <span className="spec-label">Care Instructions</span>
                <span className="spec-val">Dry Clean Only • Store in Muslin Cloth • Low Heat Ironing</span>
              </div>
            </div>
          </motion.div>

          {/* Section 2: Warm & Good Feeling Customer Reviews Listing */}
          <motion.div 
            className="listing-section warm-reviews-wrapper"
            initial={slideFromRight.initial}
            animate={slideFromRight.animate}
            transition={slideFromRight.transition}
          >
            <div className="reviews-header-banner">
              <div>
                <span className="rh-sub">COMMUNITY LOVE</span>
                <h2 className="rh-title">Customer Stories & Feedback</h2>
              </div>
              <div className="rh-right-box">
                <div className="rh-rating-badge">
                  <Star size={18} fill="#c89d36" color="#c89d36" />
                  <span className="rh-rating-num">4.9 / 5.0</span>
                  <span className="rh-count">({product.reviews || 89} Reviews)</span>
                </div>
                <button className="rh-write-btn">
                  <MessageSquarePlus size={15} /> Write a Review
                </button>
              </div>
            </div>

            <div className="reviews-warm-list">
              {sampleReviewsList.map((rev) => (
                <div key={rev.id} className="warm-review-card">
                  <Quote size={28} className="warm-quote-icon" />

                  <div className="wrc-top-bar">
                    <div className="wrc-user-profile">
                      <div className="wrc-avatar-circle">
                        {rev.author[0]}
                      </div>
                      <div className="wrc-user-meta">
                        <div className="wrc-author-name-row">
                          <h4 className="wrc-author-name">{rev.author}</h4>
                          {rev.verified && (
                            <span className="wrc-verified-badge"><CheckCircle2 size={12} /> Verified Buyer</span>
                          )}
                        </div>
                        <span className="wrc-location-date">{rev.location} • {rev.date}</span>
                      </div>
                    </div>

                    <div className="wrc-stars-box">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={15} fill="#c89d36" color="#c89d36" />
                      ))}
                    </div>
                  </div>

                  <h3 className="wrc-review-title">{rev.title}</h3>
                  <p className="wrc-review-text">"{rev.comment}"</p>

                  {rev.image && (
                    <div className="wrc-photo-frame">
                      <img src={rev.image} alt={rev.title} className="wrc-photo-img" />
                      <span className="wrc-photo-label">Customer Drape Photo</span>
                    </div>
                  )}

                  <div className="wrc-footer">
                    <button 
                      className="wrc-helpful-btn"
                      onClick={() => handleHelpfulClick(rev.id)}
                    >
                      <ThumbsUp size={13} /> Helpful ({helpfulCounts[rev.id] || 0})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
