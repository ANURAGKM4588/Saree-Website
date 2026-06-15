import { ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import './TrustBenefits.css';

const benefits = [
  { icon: ShieldCheck, title: 'Authentic Handloom', desc: 'Every saree is verified by our craft council for genuine handloom origin.' },
  { icon: Truck, title: 'Free Shipping', desc: 'Complimentary delivery across India on all orders above ₹5,000.' },
  { icon: RotateCcw, title: 'Easy Returns', desc: 'Hassle-free 14-day exchange policy. If it doesn\'t drape right, swap it.' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export default function TrustBenefits() {
  return (
    <section className="trust-section">
      <motion.div
        className="trust-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: '-60px' }}
      >
        {benefits.map((b) => (
          <motion.div key={b.title} className="trust-card" variants={itemVariants}>
            <div className="trust-icon-wrap">
              <b.icon size={24} />
            </div>
            <h3 className="trust-title">{b.title}</h3>
            <p className="trust-desc">{b.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
