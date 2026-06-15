import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './BridalBanner.css';

const BASE = import.meta.env.BASE_URL || '/';

export default function BridalBanner() {
  return (
    <section className="bridal-banner">
      <div className="bb-bg">
        <img
          src={`${BASE}images/bridalsaree/Woman_walking_with_lotus_flower_202606150000_1100.jpg`}
          alt="Bridal silk collection"
          className="bb-bg-img"
        />
        <div className="bb-overlay" />
      </div>
      <div className="bb-content">
        <motion.span
          className="bb-tag"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5 }}
        >
          THE BRIDAL EDIT
        </motion.span>
        <motion.h2
          className="bb-heading"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          For the Day Your<br />Story Begins
        </motion.h2>
        <motion.p
          className="bb-desc"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Discover our exclusive collection of bridal silks, where tradition meets timeless elegance.
          Each piece is handpicked for the discerning bride.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link to="/products" className="bb-cta">
            Explore Bridal Collection <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
