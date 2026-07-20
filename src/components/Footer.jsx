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
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
                <a href="#" aria-label="Facebook" className="social-pill">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
                <a href="#" aria-label="YouTube" className="social-pill">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
                </a>
                <a href="#" aria-label="Twitter" className="social-pill">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
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
