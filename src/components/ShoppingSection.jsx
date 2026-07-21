import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ShoppingBag, Star, Clock, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';
import { useDatabase } from '../context/DatabaseContext';
import './ShoppingSection.css';

const fadeUp = {
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, margin: '-80px' },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
};

export default function ShoppingSection() {
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();
  const { 
    featuredProducts, 
    comingSoonProducts, 
    offers, 
    registerNotification 
  } = useDatabase();

  const [activeOffer, setActiveOffer] = useState(0);
  const [notifyProductId, setNotifyProductId] = useState(null);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifyLoading, setNotifyLoading] = useState(false);
  const [notifySuccess, setNotifySuccess] = useState(null);
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: false, margin: '-80px' });

  const handleBuyNow = (product) => {
    addToCart(product);
    setIsCartOpen(true);
  };

  const handleCardClick = (productId, e) => {
    if (e.target.closest('button') || e.target.closest('a')) return;
    sessionStorage.setItem('last_viewed_product_id', productId.toString());
    sessionStorage.setItem('last_scroll_pos', window.scrollY.toString());
    navigate(`/product/${productId}`);
  };

  const productCards = (list) =>
    list.map((product, index) => (
      <motion.div
        key={product.id}
        className="product-card"
        onClick={(e) => handleCardClick(product.id, e)}
        style={{ cursor: 'pointer' }}
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

  const marqueeRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const autoScrollRef = useRef(null);
  const dragRef = useRef({ isDragging: false, startX: 0, scrollLeft: 0 });

  useEffect(() => {
    const track = marqueeRef.current;
    if (!track) return;

    const onWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        track.scrollLeft += e.deltaY;
      }
    };
    track.addEventListener('wheel', onWheel, { passive: false });

    const onMouseDown = (e) => {
      dragRef.current.isDragging = true;
      dragRef.current.startX = e.pageX - track.offsetLeft;
      dragRef.current.scrollLeft = track.scrollLeft;
      track.style.cursor = 'grabbing';
    };

    const onMouseMove = (e) => {
      if (!dragRef.current.isDragging) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (dragRef.current.startX - x) * 1.5;
      track.scrollLeft = dragRef.current.scrollLeft + walk;
    };

    const onMouseUp = () => {
      dragRef.current.isDragging = false;
      track.style.cursor = 'grab';
    };

    track.addEventListener('mousedown', onMouseDown);
    track.addEventListener('mousemove', onMouseMove);
    track.addEventListener('mouseup', onMouseUp);
    track.addEventListener('mouseleave', onMouseUp);

    const step = () => {
      if (isHovered) return;
      track.scrollLeft += 2;
      if (track.scrollLeft >= track.scrollWidth - track.clientWidth) {
        track.scrollLeft = 0;
      }
    };

    autoScrollRef.current = setInterval(step, 16);
    return () => {
      track.removeEventListener('wheel', onWheel);
      track.removeEventListener('mousedown', onMouseDown);
      track.removeEventListener('mousemove', onMouseMove);
      track.removeEventListener('mouseup', onMouseUp);
      track.removeEventListener('mouseleave', onMouseUp);
      clearInterval(autoScrollRef.current);
    };
  }, [isHovered]);

  return (
    <section className="shopping-section">
      {/* ─── Offer Marquee (full-width) ─── */}
      <div className="offer-marquee">
        <div
          ref={marqueeRef}
          className="offer-marquee-track"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {offers.map((offer, i) => (
            <div key={`${offer.id}-${i}`} className="offer-marquee-slide">
              <img src={offer.image} alt={offer.title} className="offer-marquee-img" draggable="false" />
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
                    {notifyProductId === product.id ? (
                      <form 
                        className="coming-notify-form" 
                        onSubmit={async (e) => {
                          e.preventDefault();
                          if (notifyEmail) {
                            setNotifyLoading(true);
                            const res = await registerNotification(product.id, notifyEmail);
                            setNotifyLoading(false);
                            if (res.success) {
                              setNotifySuccess(product.id);
                              setTimeout(() => {
                                setNotifyProductId(null);
                                setNotifySuccess(null);
                                setNotifyEmail('');
                              }, 3000);
                            }
                          }
                        }}
                      >
                        {notifySuccess === product.id ? (
                          <span className="notify-success-msg" style={{ color: '#d4af37', fontSize: '0.85rem', display: 'block', marginTop: '8px', fontWeight: '500' }}>✓ Alert Set!</span>
                        ) : (
                          <div className="notify-input-group" style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                            <input
                              type="email"
                              placeholder="Your email"
                              value={notifyEmail}
                              onChange={(e) => setNotifyEmail(e.target.value)}
                              required
                              disabled={notifyLoading}
                              style={{ 
                                flex: 1, 
                                padding: '6px 8px', 
                                border: '1px solid #d4af37', 
                                borderRadius: '4px',
                                background: 'transparent',
                                color: '#fff',
                                fontSize: '0.8rem'
                              }}
                            />
                            <button 
                              type="submit" 
                              disabled={notifyLoading}
                              style={{
                                padding: '6px 10px',
                                background: '#d4af37',
                                color: '#111',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                fontWeight: 'bold'
                              }}
                            >
                              Go
                            </button>
                          </div>
                        )}
                      </form>
                    ) : (
                      <button 
                        className="btn-notify"
                        onClick={() => {
                          setNotifyProductId(product.id);
                          setNotifySuccess(null);
                        }}
                      >
                        Notify Me
                      </button>
                    )}
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
