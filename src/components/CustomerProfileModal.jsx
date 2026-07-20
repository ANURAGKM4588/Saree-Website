import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, KeyRound, LogIn, UserPlus, LogOut, ArrowRight, ShieldCheck, MapPin, Sparkles } from 'lucide-react';
import './CustomerProfileModal.css';

export default function CustomerProfileModal({ isOpen, onClose }) {
  const [customerUser, setCustomerUser] = useState(null);
  const [authTab, setAuthTab] = useState('login'); // 'login' | 'signup'
  const [authForm, setAuthForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [savedAddress, setSavedAddress] = useState(null);

  useEffect(() => {
    if (isOpen) {
      try {
        const storedUser = localStorage.getItem('kadha_customer_user');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          if (parsed && parsed.email) {
            setCustomerUser(parsed);
          }
        }
        const storedAddr = localStorage.getItem('kadha_saved_address');
        if (storedAddr) {
          setSavedAddress(JSON.parse(storedAddr));
        }
      } catch (e) {
        console.error('Error loading customer session:', e);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAuthFormChange = (e) => {
    setAuthForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCustomerLogin = (e) => {
    e.preventDefault();
    setAuthError('');
    if (!authForm.email || !authForm.password) {
      setAuthError('Please enter your email address and password.');
      return;
    }

    const displayName = authForm.name || authForm.email.split('@')[0];
    const userSession = {
      name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
      email: authForm.email,
      phone: authForm.phone || '',
      loggedInAt: new Date().toISOString(),
    };

    localStorage.setItem('kadha_customer_user', JSON.stringify(userSession));
    setCustomerUser(userSession);
  };

  const handleCustomerSignup = (e) => {
    e.preventDefault();
    setAuthError('');
    if (!authForm.name || !authForm.email || !authForm.password) {
      setAuthError('Please fill in your full name, email, and password.');
      return;
    }

    const userSession = {
      name: authForm.name,
      email: authForm.email,
      phone: authForm.phone || '',
      loggedInAt: new Date().toISOString(),
    };

    localStorage.setItem('kadha_customer_user', JSON.stringify(userSession));
    setCustomerUser(userSession);
  };

  const handleCustomerLogout = () => {
    localStorage.removeItem('kadha_customer_user');
    setCustomerUser(null);
  };

  return (
    <AnimatePresence>
      <div className="cpm-backdrop" onClick={onClose}>
        <motion.div
          className="cpm-modal-card"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="cpm-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>

          {!customerUser ? (
            <div className="cpm-auth-pane">
              <div className="cpm-header">
                <img src="/logo/logo vertical.png" alt="Kadha Logo" className="cpm-brand-logo" />
                <h2 className="cpm-title">Customer Account</h2>
                <p className="cpm-subtitle">Log in or create a customer profile for express shopping & orders.</p>
              </div>

              {/* Tab Selector: Login vs Signup */}
              <div className="cpm-auth-tabs">
                <button
                  type="button"
                  className={`cpm-auth-tab-btn ${authTab === 'login' ? 'active' : ''}`}
                  onClick={() => { setAuthTab('login'); setAuthError(''); }}
                >
                  <LogIn size={14} /> Log In
                </button>
                <button
                  type="button"
                  className={`cpm-auth-tab-btn ${authTab === 'signup' ? 'active' : ''}`}
                  onClick={() => { setAuthTab('signup'); setAuthError(''); }}
                >
                  <UserPlus size={14} /> Create Account
                </button>
              </div>

              {authError && <div className="cpm-auth-error">{authError}</div>}

              {authTab === 'login' ? (
                <form className="cpm-form" onSubmit={handleCustomerLogin}>
                  <div className="cpm-input-group">
                    <label><Mail size={14} /> Email Address</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="e.g. ananya@example.com"
                      value={authForm.email}
                      onChange={handleAuthFormChange}
                      required
                      className="cpm-input"
                    />
                  </div>

                  <div className="cpm-input-group">
                    <label><KeyRound size={14} /> Password</label>
                    <input
                      type="password"
                      name="password"
                      placeholder="••••••••••••"
                      value={authForm.password}
                      onChange={handleAuthFormChange}
                      required
                      className="cpm-input"
                    />
                  </div>

                  <button type="submit" className="cpm-submit-btn">
                    Log In to Profile <ArrowRight size={16} />
                  </button>
                </form>
              ) : (
                <form className="cpm-form" onSubmit={handleCustomerSignup}>
                  <div className="cpm-input-group">
                    <label><User size={14} /> Full Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g. Ananya Sharma"
                      value={authForm.name}
                      onChange={handleAuthFormChange}
                      required
                      className="cpm-input"
                    />
                  </div>

                  <div className="cpm-input-row">
                    <div className="cpm-input-group">
                      <label><Mail size={14} /> Email Address</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="ananya@example.com"
                        value={authForm.email}
                        onChange={handleAuthFormChange}
                        required
                        className="cpm-input"
                      />
                    </div>

                    <div className="cpm-input-group">
                      <label><Phone size={14} /> Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="+91 98765 43210"
                        value={authForm.phone}
                        onChange={handleAuthFormChange}
                        required
                        className="cpm-input"
                      />
                    </div>
                  </div>

                  <div className="cpm-input-group">
                    <label><KeyRound size={14} /> Create Password</label>
                    <input
                      type="password"
                      name="password"
                      placeholder="At least 6 characters"
                      value={authForm.password}
                      onChange={handleAuthFormChange}
                      required
                      className="cpm-input"
                    />
                  </div>

                  <button type="submit" className="cpm-submit-btn">
                    Create Customer Account <ArrowRight size={16} />
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="cpm-profile-pane">
              <div className="cpm-header">
                <img src="/logo/logo vertical.png" alt="Kadha Logo" className="cpm-brand-logo" />
                <div className="cpm-avatar">👤</div>
                <h2 className="cpm-title">Welcome, {customerUser.name}!</h2>
                <p className="cpm-subtitle">{customerUser.email}</p>
              </div>

              <div className="cpm-details-box">
                <div className="cpm-detail-row">
                  <span className="cpm-label"><Mail size={13} /> Email:</span>
                  <span className="cpm-val">{customerUser.email}</span>
                </div>
                {customerUser.phone && (
                  <div className="cpm-detail-row">
                    <span className="cpm-label"><Phone size={13} /> Phone:</span>
                    <span className="cpm-val">{customerUser.phone}</span>
                  </div>
                )}
                {savedAddress && (
                  <div className="cpm-detail-row">
                    <span className="cpm-label"><MapPin size={13} /> Saved Address:</span>
                    <span className="cpm-val">{savedAddress.address}, {savedAddress.city}</span>
                  </div>
                )}
              </div>

              <div className="cpm-profile-footer">
                <button type="button" className="cpm-logout-btn" onClick={handleCustomerLogout}>
                  <LogOut size={16} /> Log Out of Account
                </button>
                <button type="button" className="cpm-done-btn" onClick={onClose}>
                  Done
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
