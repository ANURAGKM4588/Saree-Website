import { motion } from 'framer-motion';
import { Image, ExternalLink } from 'lucide-react';
import './GallerySection.css';

const BASE = import.meta.env.BASE_URL || '/';

const galleryImages = [
  `${BASE}images/herosection/ChatGPT%20Image%20Jun%2014%2C%202026%2C%2002_54_17%20PM050.jpg`,
  `${BASE}images/bridalsaree/Woman_walking_with_lotus_flower_202606150000_1020.jpg`,
  `${BASE}images/herosection/ChatGPT%20Image%20Jun%2014%2C%202026%2C%2002_54_17%20PM100.jpg`,
  `${BASE}images/bridalsaree/Woman_walking_with_lotus_flower_202606150000_1050.jpg`,
  `${BASE}images/herosection/ChatGPT%20Image%20Jun%2014%2C%202026%2C%2002_54_17%20PM005.jpg`,
  `${BASE}images/bridalsaree/Woman_walking_with_lotus_flower_202606150000_1100.jpg`,
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function GallerySection() {
  return (
    <section className="gallery-section" id="gallery">
      <div className="gl-inner">
        <motion.span
          className="gl-tag"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          FOLLOW US
        </motion.span>
        <motion.h2
          className="gl-heading"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Behind the Weave
        </motion.h2>
        <motion.p
          className="gl-desc"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Follow @zari_heritage for exclusive behind-the-scenes content, weaver stories, and new arrivals.
        </motion.p>

        <motion.div
          className="gl-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: '-40px' }}
        >
          {galleryImages.map((src, i) => (
            <motion.div key={i} className="gl-item" variants={itemVariants}>
              <img src={src} alt={`Zari gallery ${i + 1}`} className="gl-img" loading="lazy" />
              <div className="gl-item-overlay">
                <Image size={20} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="gl-follow-row"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <a
            href="https://instagram.com/zari_heritage"
            target="_blank"
            rel="noopener noreferrer"
            className="gl-follow-btn"
          >
            <Image size={18} />
            Follow @zari_heritage
            <ExternalLink size={14} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
