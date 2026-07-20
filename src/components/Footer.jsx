import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, Mail, Phone, MessageCircle, Globe, Video, Share2 } from 'lucide-react';
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
                  <Globe size={16} />
                </a>
                <a href="#" aria-label="Facebook" className="social-pill">
                  <Share2 size={16} />
                </a>
                <a href="#" aria-label="YouTube" className="social-pill">
                  <Video size={16} />
                </a>
                <a href="#" aria-label="X Twitter" className="social-pill">
                  <Send size={16} />
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
