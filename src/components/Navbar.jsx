import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, ShoppingBag, X, ChevronRight, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const navItems = [
  { name: 'Collections', href: '#collections' },
  { name: 'Bestsellers', href: '#bestsellers' },
  { name: 'Our Story', href: '#story' },
  { name: 'Gallery', href: '#gallery' },
  { name: 'Contact', href: '#contact' }
];

function formatPrice(price) {
  return '₹' + price.toLocaleString('en-IN');
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, cartTotal, cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      const heroEnd = window.innerHeight * 3;
      if (window.scrollY > heroEnd) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav 
        className={`navbar ${isScrolled ? 'scrolled' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="navbar-container">
          {/* Menu Items (Left) */}
          <ul className="nav-links">
            {navItems.map((item, idx) => (
              <li 
                key={item.name}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <a href={item.href}>
                  {item.name}
                  {hoveredIndex === idx && (
                    <motion.div 
                      className="hover-underline"
                      layoutId="nav-underline"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              </li>
            ))}
          </ul>

          {/* Logo (Center) */}
          <div className="navbar-logo">
            <a href="/">ZARI</a>
          </div>

          {/* Right Actions */}
          <div className="navbar-actions">
            {/* Search Toggle */}
            <div className={`search-wrapper ${isSearchOpen ? 'open' : ''}`}>
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.input 
                    type="text" 
                    placeholder="Search masterweaves..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 180, opacity: 1 }}
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
                {isSearchOpen ? <X size={20} /> : <Search size={20} />}
              </button>
            </div>

            {/* Wishlist */}
            <button className="action-btn wishlist-btn" aria-label="Wishlist">
              <Heart size={20} />
              <span className="badge">2</span>
            </button>

            {/* Shopping Bag */}
            <button 
              className="action-btn cart-btn" 
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping Bag"
            >
              <ShoppingBag size={20} />
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
            {/* Backdrop */}
            <motion.div 
              className="cart-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
            />

            {/* Drawer */}
            <motion.div 
              className="cart-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="cart-header">
                <h2>Shopping Bag</h2>
                <button className="close-cart-btn" onClick={() => setIsCartOpen(false)}>
                  <X size={24} />
                </button>
              </div>

              <div className="cart-content">
                {cartItems.length === 0 ? (
                  <div className="empty-cart">
                    <ShoppingBag size={48} className="empty-icon" />
                    <p>Your shopping bag is empty</p>
                    <p className="empty-sub">Explore Zari Masterpieces to fill your collection.</p>
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
                  <p className="cart-tax-info">Duties, shipping, and taxes calculated at checkout.</p>
                  <button className="checkout-btn">
                    <span>Proceed to Checkout</span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
