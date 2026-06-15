import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';
import './Newsletter.css';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="newsletter-section">
      <div className="nl-inner">
        <motion.div
          className="nl-content"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Sparkles size={28} className="nl-sparkle" />
          <span className="nl-tag">STAY CONNECTED</span>
          <h2 className="nl-heading">Join the Zari Circle</h2>
          <p className="nl-desc">
            Be the first to know about new collections, artisan stories, and exclusive offers.
          </p>

          {subscribed ? (
            <motion.div
              className="nl-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <p>Thank you! You're now part of the Zari Circle.</p>
            </motion.div>
          ) : (
            <form className="nl-form" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="nl-input"
                required
              />
              <button type="submit" className="nl-btn">
                Subscribe <Send size={16} />
              </button>
            </form>
          )}
        </motion.div>

        <div className="nl-border-gradient" />
      </div>
    </section>
  );
}
