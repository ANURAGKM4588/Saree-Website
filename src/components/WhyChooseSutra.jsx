import { motion } from 'framer-motion';
import { Shirt, Factory, RefreshCw, Shield } from 'lucide-react';
import './WhyChooseSutra.css';

const reasons = [
  {
    icon: Shirt,
    title: 'Handloom Authenticity',
    desc: 'Every saree comes with a handloom mark certificate, guaranteeing its origin from traditional looms.',
  },
  {
    icon: Factory,
    title: 'Direct from Weaver',
    desc: 'We partner directly with master weavers, eliminating middlemen and ensuring fair wages.',
  },
  {
    icon: RefreshCw,
    title: '14-Day Exchange',
    desc: 'Not the perfect drape? Exchange within 14 days — no questions asked.',
  },
  {
    icon: Shield,
    title: 'Secure Shipping',
    desc: 'Insured, trackable delivery with tamper-evident packaging for your peace of mind.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export default function WhyChooseSutra() {
  return (
    <section className="whychoose-section">
      <div className="wc-bg-glow" />
      <div className="wc-inner">
        <motion.span
          className="wc-tag"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          WHY ZARI
        </motion.span>
        <motion.h2
          className="wc-heading"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Crafted with Integrity,<br />Delivered with Care
        </motion.h2>

        <motion.div
          className="wc-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: '-60px' }}
        >
          {reasons.map((r) => (
            <motion.div key={r.title} className="wc-card" variants={itemVariants}>
              <div className="wc-icon-wrap">
                <r.icon size={28} />
              </div>
              <h3 className="wc-card-title">{r.title}</h3>
              <p className="wc-card-desc">{r.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
