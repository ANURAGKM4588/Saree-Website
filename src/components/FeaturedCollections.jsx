import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './FeaturedCollections.css';

const BASE = import.meta.env.BASE_URL || '/';

const collections = [
  {
    title: 'Banarasi',
    desc: 'Handwoven in Varanasi with real gold and silver zari — a symbol of timeless opulence.',
    image: `${BASE}images/herosection/ChatGPT Image Jun 14, 2026, 02_54_17 PM050.jpg`,
    link: '/products',
    accent: '#d4af37',
  },
  {
    title: 'Kanjeevaram',
    desc: 'Temple-woven silks from Tamil Nadu with intricate borders and a heritage that spans centuries.',
    image: `${BASE}images/herosection/ChatGPT Image Jun 14, 2026, 02_54_17 PM005.jpg`,
    link: '/products',
    accent: '#c9833e',
  },
  {
    title: 'Organza',
    desc: 'Delicate, translucent weaves for those who appreciate ethereal elegance and modern grace.',
    image: `${BASE}images/herosection/ChatGPT Image Jun 14, 2026, 02_54_17 PM100.jpg`,
    link: '/products',
    accent: '#7a9a7e',
  },
  {
    title: 'Bridal Edit',
    desc: 'Our curated collection of bridal masterpieces — for the most cherished day of your life.',
    image: `${BASE}images/bridalsaree/Woman_walking_with_lotus_flower_202606150000_1020.jpg`,
    link: '/products',
    accent: '#c0392b',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function FeaturedCollections() {
  return (
    <section className="featured-collections" id="collections">
      <div className="fc-inner">
        <motion.span
          className="fc-tag"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          CURATED COLLECTIONS
        </motion.span>
        <motion.h2
          className="fc-heading"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Explore Our World of Silk
        </motion.h2>
        <motion.p
          className="fc-desc"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          From the sacred looms of Varanasi to the temple towns of Tamil Nadu, each weave tells a story.
        </motion.p>

        <div className="fc-grid">
          {collections.map((col, i) => (
            <motion.div
              key={col.title}
              className="fc-card"
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, margin: '-50px' }}
            >
              <div className="fc-card-img-wrap">
                <img src={col.image} alt={col.title} className="fc-card-img" loading="lazy" />
                <div className="fc-card-overlay" />
              </div>
              <div className="fc-card-body">
                <h3 className="fc-card-title" style={{ borderColor: col.accent }}>{col.title}</h3>
                <p className="fc-card-desc">{col.desc}</p>
                <Link to={col.link} className="fc-card-link">
                  Explore <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
