import React, { useRef } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import './Testimonials.css';

const reviews = [
  {
    name: 'Hetal Shah',
    location: 'Delhi, India',
    rating: 5.0,
    text: '"Beautiful dress, perfect size. I ordered for my sister\'s wedding and it arrived on time. The fabric quality is exceptional."'
  },
  {
    name: 'Indu Vasavala',
    location: 'Mumbai, India',
    rating: 5.0,
    text: '"This is my second jewelry order from GG Fashion. I loved them both. They arrived well packed and exactly as shown in pictures."'
  },
  {
    name: 'Rayn',
    location: 'Delhi, India',
    rating: 5.0,
    text: '"Beautiful necklace. Good experience shopping here. The customer support was very helpful with size customization."'
  },
  {
    name: 'Ananya Sharma',
    location: 'Mumbai, India',
    rating: 5.0,
    text: '"The Banarasi Royal Velvet is an absolute masterpiece. The zari work is stunning and catches the light perfectly."'
  }
];

export default function Testimonials() {
  const sliderRef = useRef(null);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 340;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="reviews-section">
      <div className="reviews-container">
        <div className="reviews-header">
          <h2 className="reviews-title">
            Reviews & <span className="gold-text">Ratings</span>
          </h2>
          <button className="view-all-reviews">VIEW ALL</button>
        </div>

        <div className="reviews-slider-wrapper">
          <button 
            className="slider-btn left" 
            onClick={() => scroll('left')}
            aria-label="Scroll Left"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="reviews-slider" ref={sliderRef}>
            {reviews.map((r, index) => (
              <div key={index} className="review-card">
                <div className="review-stars-row">
                  <span className="rating-num">{r.rating.toFixed(1)}</span>
                  <div className="stars-wrap">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} fill="var(--color-gold)" color="var(--color-gold)" />
                    ))}
                  </div>
                </div>
                
                <p className="review-text">{r.text}</p>
                
                <div className="reviewer-info">
                  <div className="reviewer-avatar">
                    {r.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="reviewer-details">
                    <h4 className="reviewer-name">{r.name}</h4>
                    <span className="reviewer-loc">{r.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            className="slider-btn right" 
            onClick={() => scroll('right')}
            aria-label="Scroll Right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
