import React from 'react';
import { motion } from 'framer-motion';
import './StorySection.css';

const BASE = import.meta.env.BASE_URL || '/';

const fadeInUp = {
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, margin: '-100px' },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
};

export default function StorySection() {
  return (
    <section className="story-section" id="story">
      {/* Legacy Panel */}
      <div className="legacy-panel">
        <div className="legacy-container">
          <div className="legacy-image-col">
            <motion.div
              className="legacy-img-wrapper"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, margin: '-100px' }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <img
                src={`${BASE}images/herosection/ChatGPT%20Image%20Jun%2014%2C%202026%2C%2002_54_17%20PM001.jpg`}
                alt="Handwoven silk saree detail"
                className="legacy-img"
              />
            </motion.div>
          </div>

          <div className="legacy-text-col">
            <motion.span
              className="legacy-tag"
              {...fadeInUp}
            >
              A LEGACY DRAPED IN TRADITION
            </motion.span>
            <motion.h2
              className="legacy-heading"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-100px' }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              Where Every Thread<br />Tells a Story
            </motion.h2>
            <motion.p
              className="legacy-paragraph"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-100px' }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              For generations, our looms have whispered stories of timeless grace, weaving every thread with devotion. Each saree is a living archive — carrying forward techniques passed down through centuries of master craftsmanship.
            </motion.p>
            <motion.p
              className="legacy-paragraph"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-100px' }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              From the sacred city of Varanasi to the temple towns of Kanchipuram, our weavers transform fine silk into poetry. Every zari border, every butti, every weave is a testament to India's unparalleled textile heritage.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Quote Banner */}
      <div className="story-quote">
        <motion.p
          className="quote-text"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          "A saree is not merely attire. It is a canvas of heritage, draped in dignity."
        </motion.p>
        <motion.span
          className="quote-author"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          — Master Weaver S. Rahman
        </motion.span>
      </div>
    </section>
  );
}
