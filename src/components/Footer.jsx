import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Image, Globe, Video, Send, Mail, MapPin, Phone } from 'lucide-react';
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
      setSuccess('Thank you for subscribing!');
      setEmail('');
    } else {
      setSuccess('Failed to subscribe. Please try again.');
    }
  };

  return (
    <footer className="new-footer" id="contact">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Column 1: About */}
          <div className="footer-column brand-col">
            <div className="footer-logo-wrapper">
              <img src="/logo/logo vertical white.png" alt="Kadha Logo" className="footer-logo-img" />
            </div>
            <p className="footer-about-text">
              Your destination for premium ethnic wear. We blend traditional craftsmanship with modern silhouettes to bring you the finest sarees, lehengas, and suits.
            </p>
            <div className="footer-social-row">
              <a href="#" className="social-icon-btn" aria-label="Facebook">
                <Globe size={18} />
              </a>
              <a href="#" className="social-icon-btn" aria-label="Instagram">
                <Image size={18} />
              </a>
              <a href="#" className="social-icon-btn" aria-label="Youtube">
                <Video size={18} />
              </a>
              <a href="#" className="social-icon-btn" aria-label="Twitter">
                <Send size={18} />
              </a>
            </div>
            <div className="payment-gateways">
              <span className="payment-badge">VISA</span>
              <span className="payment-badge">MC</span>
              <span className="payment-badge">UPI</span>
              <span className="payment-badge">COD</span>
            </div>
          </div>

          {/* Column 2: Shop Online */}
          <div className="footer-column links-col">
            <h4 className="footer-col-title">SHOP ONLINE</h4>
            <ul className="footer-links-list">
              <li><Link to="/products">New Arrivals</Link></li>
              <li><Link to="/products?category=Banarasi">Banarasi Sarees</Link></li>
              <li><Link to="/products">Designer Lehengas</Link></li>
              <li><Link to="/products">Party Wear Suits</Link></li>
              <li><Link to="/products">Festive Collection</Link></li>
              <li><Link to="/products">Sale</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div className="footer-column links-col">
            <h4 className="footer-col-title">CUSTOMER CARE</h4>
            <ul className="footer-links-list">
              <li><a href="#">Track Order</a></li>
              <li><a href="#">Return & Exchange</a></li>
              <li><a href="#">Shipping Policy</a></li>
              <li><a href="#">Terms & Conditions</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>

          {/* Column 4: Stay Connected */}
          <div className="footer-column connect-col">
            <h4 className="footer-col-title">STAY CONNECTED</h4>
            <p className="subscribe-info-text">
              Subscribe to get exclusive offers and new launch updates.
            </p>
            <form className="subscribe-form" onSubmit={handleSubmit}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="subscribe-input"
              />
              <button type="submit" disabled={loading} className="subscribe-btn">
                {loading ? '...' : <Send size={14} />}
              </button>
            </form>
            {success && <p className="subscribe-status">{success}</p>}

            <div className="contact-details-list">
              <div className="contact-item">
                <MapPin size={16} className="contact-icon" />
                <span>C-202, Sector-2, Greater Noida, Uttar Pradesh - 201310</span>
              </div>
              <div className="contact-item">
                <Phone size={16} className="contact-icon" />
                <span>+91 8278288888</span>
              </div>
              <div className="contact-item">
                <Mail size={16} className="contact-icon" />
                <span>support@kadhafashion.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p>© 2026 Kadha Fashion. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
