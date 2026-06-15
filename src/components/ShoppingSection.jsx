import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ShoppingBag, Star, Clock, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { featuredProducts, comingSoonProducts, offers, formatPrice } from '../data/products';
import './ShoppingSection.css';

const fadeUp = {
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, margin: '-80px' },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
};

export default function ShoppingSection() {
  const { addToCart, setIsCartOpen } = useCart();
  const [activeOffer, setActiveOffer] = useState(0);
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: false, margin: '-80px' });

  const handleBuyNow = (product) => {
    addToCart(product);
    setIsCartOpen(true);
  };

  const productCards = (list) =>
    list.map((product, index) => (
      <motion.div
        key={product.id}
        className="product-card"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: '-60px' }}
        transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link to={`/product/${product.id}`} className="product-image-link">
          <div className="product-image-wrapper">
            <div className="product-tag">{product.tag}</div>
            <img
              src={product.image}
              alt={product.name}
              className="product-image"
              loading="lazy"
            />
            {product.originalPrice && (
              <div className="product-discount">
                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
              </div>
            )}
          </div>
        </Link>

        <div className="product-info">
          <Link to={`/product/${product.id}`} className="product-info-link">
            <span className="product-material">{product.material}</span>
            <h3 className="product-name">{product.name}</h3>
          </Link>

          <div className="product-rating">
            <Star size={13} fill="#d4af37" color="#d4af37" />
            <span className="rating-value">{product.rating}</span>
            <span className="rating-count">({product.reviews})</span>
          </div>

          <div className="product-price-row">
            <div className="product-prices">
              <span className="price-current">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="price-original">{formatPrice(product.originalPrice)}</span>
              )}
            </div>
          </div>

          <div className="product-actions">
            <button className="btn-add-cart" onClick={() => addToCart(product)}>
              <ShoppingBag size={15} /> Add to Bag
            </button>
            <button className="btn-buy-now" onClick={() => handleBuyNow(product)}>
              Buy Now
            </button>
          </div>
        </div>
      </motion.div>
    ));

  return (
    <section className="shopping-section">
      {/* ─── Offer Marquee (full-width) ─── */}
      <div className="offer-marquee">
        <div className="offer-marquee-track">
          {[...offers, ...offers].map((offer, i) => (
            <div key={`${offer.id}-${i}`} className="offer-marquee-slide">
              <img src={offer.image} alt={offer.title} className="offer-marquee-img" />
              <div className="offer-overlay" />
              <div className="offer-badge-row">
                {offer.discount && (
                  <span className="offer-discount-badge">-{offer.discount}</span>
                )}
                <span className="offer-subtitle">{offer.subtitle}</span>
              </div>
              <div className="offer-banner-content">
                <h3 className="offer-banner-title">{offer.title}</h3>
                <p className="offer-banner-desc">{offer.desc}</p>
                <button className="offer-banner-cta">{offer.cta}</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="shopping-inner">

        {/* ─── Live Offers Strip ─── */}
        <motion.div
          className="live-offers-strip"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
        >
          <div className="live-offers-left">
            <span className="live-dot" />
            <span className="live-label">LIVE OFFERS</span>
          </div>
          <div className="live-offers-ticker">
            {offers.map((o) => (
              <span key={o.id} className="ticker-item">
                {o.title}
              </span>
            ))}
          </div>
        </motion.div>

        {/* ─── Header ─── */}
        <div ref={headingRef} className="shopping-header">
          <motion.span
            className="shopping-tag"
            initial={{ opacity: 0, y: 20 }}
            animate={headingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            CURATED COLLECTION
          </motion.span>
          <motion.h2
            className="shopping-heading"
            initial={{ opacity: 0, y: 30 }}
            animate={headingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Masterpieces Worth<br />Cherishing
          </motion.h2>
          <motion.p
            className="shopping-desc"
            initial={{ opacity: 0, y: 30 }}
            animate={headingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Each saree is handpicked from the finest looms across India — a testament to
            craftsmanship passed down through centuries.
          </motion.p>
        </div>

        {/* ─── Featured Products ─── */}
        <div className="product-grid">{productCards(featuredProducts)}</div>

        {/* ─── View All ─── */}
        <motion.div
          className="view-all-row"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link to="/products" className="view-all-link">
            Explore All Sarees <ArrowRight size={18} />
          </Link>
        </motion.div>

        {/* ─── Coming Soon ─── */}
        {comingSoonProducts.length > 0 && (
          <div className="coming-soon-section">
            <motion.div
              className="coming-soon-header"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6 }}
            >
              <Clock size={22} className="coming-icon" />
              <h2 className="coming-heading">Coming Soon</h2>
              <p className="coming-desc">
                Masterpieces currently being woven. Sign up to be notified.
              </p>
            </motion.div>

            <div className="coming-grid">
              {comingSoonProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  className="coming-card"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  <div className="coming-image-wrapper">
                    <img src={product.image} alt={product.name} className="coming-image" />
                    <div className="coming-overlay-badge">Coming Soon</div>
                  </div>
                  <div className="coming-info">
                    <span className="coming-material">{product.material}</span>
                    <h4 className="coming-name">{product.name}</h4>
                    <span className="coming-price">{formatPrice(product.price)}</span>
                    <button className="btn-notify">Notify Me</button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
