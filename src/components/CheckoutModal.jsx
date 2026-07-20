import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, CreditCard, CheckCircle, ArrowRight, Lock, MapPin, User, Mail, Phone } from 'lucide-react';
import { formatPrice } from '../data/products';
import { triggerRazorpayCheckout } from '../utils/razorpay';
import './CheckoutModal.css';

import { sendOrderConfirmationEmail } from '../utils/emailService';

export default function CheckoutModal({ isOpen, onClose, items = [], total = 0, onPaymentSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
  });

  const [loading, setLoading] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePayWithRazorpay = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      alert('Please fill in your name, email, phone number, and delivery address.');
      return;
    }

    setLoading(true);

    triggerRazorpayCheckout({
      amount: total,
      items: items,
      customerInfo: formData,
      onSuccess: async (paymentDetails) => {
        setLoading(false);
        setCompletedOrder(paymentDetails);
        
        // Automated Order Confirmation Email
        await sendOrderConfirmationEmail(paymentDetails);

        if (onPaymentSuccess) {
          onPaymentSuccess(paymentDetails);
        }
      },
      onFailure: (reason) => {
        setLoading(false);
        if (reason !== 'Payment window closed') {
          alert(`Payment Status: ${reason}`);
        }
      },
    });
  };

  const handleClose = () => {
    setCompletedOrder(null);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="checkout-modal-backdrop" onClick={handleClose}>
        <motion.div
          className="checkout-modal-card"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="cm-close-btn" onClick={handleClose} aria-label="Close">
            <X size={20} />
          </button>

          {!completedOrder ? (
            <div className="cm-body-grid">
              {/* Left Form: Shipping Details */}
              <div className="cm-form-col">
                <div className="cm-header">
                  <img src="/logo/herologo.png" alt="Kadha Logo" className="cm-brand-logo" />
                  <h2 className="cm-title">Express Checkout</h2>
                  <p className="cm-subtitle">Enter your delivery details to initiate secure Razorpay payment.</p>
                </div>

                <form className="cm-form" onSubmit={handlePayWithRazorpay}>
                  <div className="cm-input-group">
                    <label><User size={14} /> Full Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g. Ananya Sharma"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="cm-input"
                    />
                  </div>

                  <div className="cm-input-row">
                    <div className="cm-input-group">
                      <label><Mail size={14} /> Email Address</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="ananya@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="cm-input"
                      />
                    </div>

                    <div className="cm-input-group">
                      <label><Phone size={14} /> Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="cm-input"
                      />
                    </div>
                  </div>

                  <div className="cm-input-group">
                    <label><MapPin size={14} /> Delivery Address</label>
                    <input
                      type="text"
                      name="address"
                      placeholder="House/Flat No., Street, Area"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="cm-input"
                    />
                  </div>

                  <div className="cm-input-row">
                    <div className="cm-input-group">
                      <label>City</label>
                      <input
                        type="text"
                        name="city"
                        placeholder="e.g. Bangalore"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="cm-input"
                      />
                    </div>

                    <div className="cm-input-group">
                      <label>Pincode</label>
                      <input
                        type="text"
                        name="pincode"
                        placeholder="560001"
                        value={formData.pincode}
                        onChange={handleChange}
                        required
                        className="cm-input"
                      />
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className="cm-pay-btn">
                    {loading ? (
                      'Connecting to Razorpay...'
                    ) : (
                      <>
                        <CreditCard size={18} /> Pay {formatPrice(total)} via Razorpay
                      </>
                    )}
                  </button>

                  <div className="cm-security-badge">
                    <Lock size={13} />
                    <span>256-Bit SSL Encrypted • Powered by <strong>Razorpay</strong></span>
                  </div>
                </form>
              </div>

              {/* Right Col: Order Summary */}
              <div className="cm-summary-col">
                <h3 className="cm-summary-title">Order Summary ({items.length})</h3>
                <div className="cm-items-scroll">
                  {items.map((item) => (
                    <div key={item.id} className="cm-item-row">
                      <img src={item.image} alt={item.name} className="cm-item-thumb" />
                      <div className="cm-item-meta">
                        <span className="cm-item-name">{item.name}</span>
                        <span className="cm-item-qty">Qty: {item.qty}</span>
                      </div>
                      <span className="cm-item-price">{formatPrice(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>

                <div className="cm-calc-box">
                  <div className="cm-calc-row">
                    <span>Subtotal</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="cm-calc-row">
                    <span>Insured Shipping</span>
                    <span className="cm-free-text">FREE</span>
                  </div>
                  <div className="cm-calc-row cm-total-row">
                    <span>Grand Total</span>
                    <span className="cm-total-val">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Order Success Receipt Ticket */
            <div className="cm-success-wrapper">
              <div className="cm-success-badge">
                <CheckCircle size={54} className="success-icon-anim" />
              </div>
              <h2 className="cm-success-title">Payment Successful!</h2>
              <p className="cm-success-subtitle">
                Thank you for your order. Your authentic KADHA silk sarees are being packed with care.
              </p>

              <div className="cm-ticket-card">
                <div className="cm-ticket-row">
                  <span className="tk-label">Payment ID:</span>
                  <span className="tk-val gold-tk">{completedOrder.razorpay_payment_id}</span>
                </div>
                <div className="cm-ticket-row">
                  <span className="tk-label">Order ID:</span>
                  <span className="tk-val">{completedOrder.razorpay_order_id}</span>
                </div>
                <div className="cm-ticket-row">
                  <span className="tk-label">Amount Paid:</span>
                  <span className="tk-val bold-tk">{formatPrice(completedOrder.amount)}</span>
                </div>
                <div className="cm-ticket-row">
                  <span className="tk-label">Payment Method:</span>
                  <span className="tk-val">Razorpay (Verified)</span>
                </div>
                <div className="cm-ticket-row">
                  <span className="tk-label">Delivery Address:</span>
                  <span className="tk-val">{completedOrder.customer.address}, {completedOrder.customer.city}</span>
                </div>
              </div>

              <div className="cm-success-actions">
                <button className="cm-done-btn" onClick={handleClose}>
                  Continue Shopping <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
