import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import './Testimonials.css';

const testimonials = [
  {
    name: 'Ananya Sharma',
    location: 'Mumbai, India',
    text: 'I ordered the Kanjeevaram Divine Lotus for my wedding, and it was absolutely breathtaking. The quality of the silk and the precision of the zari work exceeded every expectation.',
    rating: 5,
  },
  {
    name: 'Priya Kapoor',
    location: 'Dubai, UAE',
    text: 'The Banarasi Royal Velvet is a masterpiece. The gold zari catches the light beautifully, and the drape is impeccable. My family heirloom collection just got richer.',
    rating: 5,
  },
  {
    name: 'Rhea Mehta',
    location: 'New York, USA',
    text: 'Shipping to the US was seamless, and the saree arrived in pristine condition. The Organza Floral Dream is even more stunning in person — lightweight, elegant, and truly unique.',
    rating: 5,
  },
  {
    name: 'Neha Verma',
    location: 'Bangalore, India',
    text: 'Zari has become my go-to for festive wear. The Patola Heritage Weave I purchased is a conversation starter at every gathering. Pure craftsmanship at its finest.',
    rating: 5,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export default function Testimonials() {
  return (
    <section className="testimonials-section">
      <div className="tm-inner">
        <motion.span
          className="tm-tag"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          FROM OUR COMMUNITY
        </motion.span>
        <motion.h2
          className="tm-heading"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Loved by Connoisseurs<br />of Craft
        </motion.h2>

        <motion.div
          className="tm-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: '-60px' }}
        >
          {testimonials.map((t) => (
            <motion.div key={t.name} className="tm-card" variants={cardVariants}>
              <Quote size={24} className="tm-quote-icon" />
              <div className="tm-stars">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={14} fill="#d4af37" color="#d4af37" />
                ))}
              </div>
              <p className="tm-text">{t.text}</p>
              <div className="tm-author">
                <div className="tm-avatar">
                  {t.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <p className="tm-name">{t.name}</p>
                  <p className="tm-location">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
