import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, ShoppingBag, X, ChevronRight, ChevronDown, Trash2, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useDatabase } from '../context/DatabaseContext';
import CheckoutModal from './CheckoutModal';
import CustomerProfileModal from './CustomerProfileModal';
import './Navbar.css';

const announcementMessages = [
  "✨ KADHA: World's Largest Silk Saree Showroom Network",
  "📦 Free Express Delivery Across India on Orders Above ₹2,999",
  "👑 Pure Kanjivaram & Banarasi Silk Sarees — Handpicked Crafts"
];

const navCategories = [
  { 
    name: 'Sarees', 
    href: '#fabric-section',
    subItems: [
      { label: 'Pure Silk', link: '/products?search=Silk' },
      { label: 'Semi Silk', link: '/products?search=Silk' },
      { label: 'Tissue Organza', link: '/products?category=Organza' },
      { label: 'Soft Linen', link: '/products?category=Cotton' },
      { label: 'Shimmer Brocade', link: '/products?search=Shimmer' }
    ] 
  },
  { 
    name: 'Occasion', 
    href: '#occasion-section',
    subItems: [
      { label: 'Weddings & Grand Events', link: '/products?category=Kanjeevaram' },
      { label: 'Festive & Onam Celebrations', link: '/products?category=Onam' },
      { label: 'Evenings & Celebrations', link: '/products?category=Organza' },
      { label: 'Work & Everyday Grace', link: '/products?category=Cotton' }
    ] 
  },
  { 
    name: 'Bridal & Kanjivaram', 
    href: '#bridal-section',
    subItems: [
      { label: 'Brocade Jacquard', link: '/products?category=Banarasi' },
      { label: 'Kanchipuram Pure Silk', link: '/products?category=Kanjeevaram' },
      { label: 'Banarasi Zari', link: '/products?category=Banarasi' },
      { label: 'Raj Gharana Edition', link: '/products?category=Bridal' }
    ] 
  },
  { 
    name: 'Patterns', 
    href: '#pattern-section',
    subItems: [
      { label: 'Floral', link: '/products?search=Floral' },
      { label: 'Checks', link: '/products?search=Check' },
      { label: 'Zari Woven', link: '/products?search=Zari' },
      { label: 'Embroidery', link: '/products?search=Embroidery' },
      { label: 'Handwork', link: '/products?search=Handwork' },
      { label: 'Shimmer', link: '/products?search=Shimmer' }
    ] 
  },
  { name: 'All Collections', href: '/products' },
  { name: 'Our Story', href: '#story-section' },
  { name: 'Contact', href: '#contact' },
];

function formatPrice(price) {
  return '₹' + price.toLocaleString('en-IN');
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, cartTotal, cartCount, wishlist, toggleWishlist, wishlistCount, addToCart, clearCart } = useCart();
  const { products: dbProducts } = useDatabase();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [announcementIdx, setAnnouncementIdx] = useState(0);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIdx((prev) => (prev + 1) % announcementMessages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleNavClick = (e, item) => {
    e.preventDefault();
    if (item.href === '/products') {
      navigate('/products');
      window.scrollTo(0, 0);
      setActiveDropdown(null);
      return;
    }

    const targetId = item.href.replace('#', '');

    const scrollToTarget = () => {
      const el = document.getElementById(targetId) || (targetId === 'contact' ? document.querySelector('footer') : null);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    if (targetId === 'contact') {
      scrollToTarget();
    } else if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        scrollToTarget();
      }, 200);
    } else {
      scrollToTarget();
    }
    setActiveDropdown(null);
  };

  const handleSubLinkClick = (e, link) => {
    e.preventDefault();
    setActiveDropdown(null);
    navigate(link);
    window.scrollTo(0, 0);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      window.scrollTo(0, 0);
    }
  };

  const isHomepage = location.pathname === '/';

  useEffect(() => {
    if (!isHomepage) {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      const heroHeight = window.innerHeight * 0.9;
      if (window.scrollY > heroHeight) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    setIsScrolled(window.scrollY > window.innerHeight * 0.9);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomepage]);

  return (
    <>
      {/* Top Announcement Ticker Bar — Clean & Centered */}
      <div className={`kalyan-announcement-bar ${isScrolled ? 'hidden-scrolled' : ''}`}>
        <div className="announcement-content">
          <AnimatePresence mode="wait">
            <motion.span 
              key={announcementIdx}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4 }}
              className="announcement-text"
            >
              {announcementMessages[announcementIdx]}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      <motion.nav 
        className={`navbar ${isScrolled ? 'scrolled' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="navbar-container">
          {/* Brand Logo */}
          <div className="navbar-brand">
            <Link to="/" className="brand-logo-link" onClick={() => window.scrollTo(0, 0)}>
              <img src="/logo/logo vertical white.png" alt="KADHA Logo" className="brand-logo-img" />
            </Link>
          </div>

          {/* Main Navigation Menu */}
          <ul className="nav-links">
            {navCategories.map((item) => (
              <li 
                key={item.name}
                className="nav-item-dropdown-container"
                onMouseEnter={() => item.subItems && setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <a 
                  href={item.href} 
                  onClick={(e) => handleNavClick(e, item)}
                  className="nav-item-link"
                >
                  {item.name}
                  {item.subItems && <ChevronDown size={14} className="dropdown-arrow" />}
                </a>

                {/* Submenu Mega Dropdown */}
                {item.subItems && activeDropdown === item.name && (
                  <motion.div 
                    className="kalyan-mega-dropdown"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="mega-dropdown-grid">
                      {item.subItems.map((subObj, sIdx) => (
                        <a 
                          key={sIdx} 
                          href={subObj.link} 
                          onClick={(e) => handleSubLinkClick(e, subObj.link)} 
                          className="mega-sub-link"
                        >
                          <span className="gold-bullet">♦</span> {subObj.label}
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </li>
            ))}
          </ul>

          {/* Right Actions */}
          <div className="navbar-actions">
            {/* Search Toggle */}
            <div className={`search-wrapper ${isSearchOpen ? 'open' : ''}`}>
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.input 
                    type="text" 
                    placeholder="Search silk sarees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchSubmit}
                    className="search-input"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 200, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    autoFocus
                  />
                )}
              </AnimatePresence>
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="action-btn"
                aria-label="Search"
              >
                {isSearchOpen ? <X size={18} /> : <Search size={18} />}
              </button>
            </div>

            {/* Customer Account / Login Profile */}
            <button 
              className="action-btn profile-btn"
              onClick={() => setIsProfileModalOpen(true)}
              title="Customer Account"
              aria-label="Customer Account"
            >
              <User size={18} />
            </button>

            {/* Wishlist */}
            <button 
              className="action-btn wishlist-btn" 
              onClick={() => {
                navigate('/wishlist');
                window.scrollTo(0, 0);
              }}
              aria-label="Wishlist"
              title="View Liked Sarees"
            >
              <Heart size={18} fill={wishlistCount > 0 ? "#ffffff" : "none"} color={wishlistCount > 0 ? "#ffffff" : "currentColor"} />
              {wishlistCount > 0 && (
                <span className="badge">{wishlistCount}</span>
              )}
            </button>

            {/* Shopping Bag */}
            <button 
              className="action-btn cart-btn" 
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping Bag"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="badge">{cartCount}</span>
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              className="cart-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
            />

            <motion.div 
              className="cart-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="cart-header">
                <h2>Shopping Bag ({cartCount})</h2>
                <button className="close-cart-btn" onClick={() => setIsCartOpen(false)}>
                  <X size={22} />
                </button>
              </div>

              <div className="cart-content">
                {cartItems.length === 0 ? (
                  <div className="empty-cart">
                    <ShoppingBag size={48} className="empty-icon" />
                    <p>Your shopping bag is empty</p>
                    <p className="empty-sub">Explore authentic silk sarees to build your collection.</p>
                  </div>
                ) : (
                  <div className="cart-items-list">
                    {cartItems.map((item) => (
                      <motion.div 
                        key={item.id} 
                        className="cart-item"
                        layout
                        exit={{ opacity: 0, y: 50 }}
                      >
                        <div className="cart-item-img-wrapper">
                          <img src={item.image} alt={item.name} className="cart-item-img" />
                        </div>
                        <div className="cart-item-details">
                          <span className="cart-item-material">{item.material}</span>
                          <h4 className="cart-item-name">{item.name}</h4>
                          <div className="cart-item-footer">
                            <span className="cart-item-price">{formatPrice(item.price)}</span>
                            <div className="cart-qty-row">
                              <span className="cart-item-qty">Qty: {item.qty}</span>
                              <button 
                                className="remove-item-btn"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="cart-footer">
                  <div className="cart-subtotal">
                    <span>Subtotal</span>
                    <span className="subtotal-amount">{formatPrice(cartTotal)}</span>
                  </div>
                  <p className="cart-tax-info">Free shipping applied on all silk sarees.</p>
                  <button 
                    className="checkout-btn"
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckoutOpen(true);
                    }}
                  >
                    <span>Proceed to Checkout</span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Razorpay Checkout Modal */}
      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        total={cartTotal}
        onPaymentSuccess={() => {
          clearCart();
        }}
      />

      {/* Standalone Customer Profile / Login Modal */}
      <CustomerProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
}
