import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, Mail, Phone, MessageCircle } from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import './Footer.css';

export default function Footer() {
  const { subscribeToNewsletter } = useDatabase();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setLoading(true);
    const res = await subscribeToNewsletter(email.trim());
    setLoading(false);
    
    if (res.success) {
      setSuccess('Thank you for joining the KADHA family!');
      setEmail('');
    } else {
      setSuccess('Subscription failed. Please try again.');
    }
  };

  return (
    <footer className="kalyan-footer" id="contact">
      {/* Top Newsletter Bar */}
      <div className="footer-newsletter-bar">
        <div className="fn-container">
          <div className="fn-text">
            <h3>Subscribe to KADHA Offers</h3>
            <p>Get special festival offers, new collection drops, and once-in-a-lifetime deals delivered to your inbox.</p>
          </div>
          <form className="fn-form" onSubmit={handleSubmit}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="fn-input"
            />
            <button type="submit" disabled={loading} className="fn-btn">
              {loading ? 'Subscribing...' : 'Subscribe Now'} <Send size={14} />
            </button>
          </form>
        </div>
        {success && <p className="fn-status">{success}</p>}
      </div>

      <div className="kalyan-footer-main">
        <div className="footer-container">
          <div className="footer-cols-grid">
            {/* Col 1: Brand Info */}
            <div className="footer-col brand-col">
              <div className="footer-logo">
                <img src="/logo/logo vertical white.png" alt="KADHA Logo" className="footer-logo-img" />
              </div>
              <p className="footer-bio">
                Welcome to the world of KADHA, the world’s largest silk saree showroom network and the most trusted brand for over a century.
              </p>
              <div className="social-links-row">
                <a href="#" aria-label="Instagram" className="social-pill">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="#" aria-label="Facebook" className="social-pill">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/></svg>
                </a>
                <a href="#" aria-label="YouTube" className="social-pill">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                </a>
                <a href="#" aria-label="X Twitter" className="social-pill">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              </div>
            </div>

            {/* Col 2: Categories */}
            <div className="footer-col">
              <h4 className="footer-heading">Categories</h4>
              <ul className="footer-list">
                <li><Link to="/products?fabric=Pure Silk">Pure Silk Sarees</Link></li>
                <li><Link to="/products?fabric=Semi Silk">Semi Silk Sarees</Link></li>
                <li><Link to="/products?fabric=Georgette">Georgette Sarees</Link></li>
                <li><Link to="/products?fabric=Brocade">Brocade Art Silk</Link></li>
                <li><Link to="/products?fabric=Organza">Organza Collection</Link></li>
                <li><Link to="/products?category=Bridal">Bridal Kanjivaram</Link></li>
                <li><Link to="/products?category=RajGharana">Raj Gharana Edition</Link></li>
                <li><Link to="/products">Bestsellers & Offers</Link></li>
              </ul>
            </div>

            {/* Col 3: KADHA Info */}
            <div className="footer-col">
              <h4 className="footer-heading">KADHA</h4>
              <ul className="footer-list">
                <li><a href="#story">About Us</a></li>
                <li><a href="#fabric-section">Our Showrooms</a></li>
                <li><a href="#reviews-section">Customer Stories</a></li>
                <li><a href="#bridal-section">CSR Initiatives</a></li>
                <li><a href="#contact">Contact Support</a></li>
                <li><a href="#pattern-section">Annual Return</a></li>
                <li><a href="#pattern-section">Scheme of Arrangement</a></li>
                <li><a href="#contact">Sitemap</a></li>
              </ul>
            </div>

            {/* Col 4: Support & Live Shopping */}
            <div className="footer-col support-col">
              <h4 className="footer-heading">Customer Support</h4>
              <div className="support-items-list">
                <a href="tel:8129966333" className="support-item">
                  <Phone size={15} /> +91 81299 66333
                </a>
                <a href="tel:04872434000" className="support-item">
                  <Phone size={15} /> 0487 2434000
                </a>
                <a href="mailto:customerservice@kadha.com" className="support-item">
                  <Mail size={15} /> customerservice@kadha.com
                </a>
                <a href="https://wa.me/914872434000?text=Hi" target="_blank" rel="noreferrer" className="support-item whatsapp-btn">
                  <MessageCircle size={15} /> Live WhatsApp Video Shopping
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar policies */}
      <div className="kalyan-footer-bottom">
        <div className="bottom-container">
          <p>© 2026 KADHA India. All Rights Reserved. Crafted for authentic silk lovers.</p>
          <div className="policy-links">
            <a href="#">Privacy Policy</a>
            <span>•</span>
            <a href="#">Shipping Policy</a>
            <span>•</span>
            <a href="#">Terms of Service</a>
            <span>•</span>
            <a href="#">Return Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
