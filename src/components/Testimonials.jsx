import React, { useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle2 } from 'lucide-react';
import './Testimonials.css';

const kalyanReviews = [
  {
    title: 'Quality, Fit, and Care',
    name: 'Ananya & Family',
    location: 'Kerala, India',
    rating: 5.0,
    text: 'As a customer, I value the quality and variety that KADHA provides. The customer care team arranged custom stitching for our event and delivered with exceptional promptness. The fit and silk quality were amazing!'
  },
  {
    title: 'Making Every Gift Special',
    name: 'Prajith Nair',
    location: 'Salalah, Oman',
    rating: 5.0,
    text: 'I was searching for a special pure silk saree for my wife’s birthday. The online support team customized the saree according to my requirement and delivered smoothly abroad. KADHA customer support is truly outstanding!'
  },
  {
    title: 'Excellent Video Shopping Experience',
    name: 'Dr. Meera Menon',
    location: 'Bangalore, India',
    rating: 5.0,
    text: 'Purchased a Kanjivaram saree via assisted video shopping. The executive patiently showed different saree options on video and explained the zari weight & fabric clearly. The saree delivered was identical and gorgeous!'
  },
  {
    title: 'Always Happy Shopping at KADHA',
    name: 'Chitra Nair',
    location: 'Kochi, Kerala',
    rating: 5.0,
    text: 'Shopping has become very common, but my favorite destination is always KADHA online store. You can find great collections for every celebration with 100% genuine silk quality.'
  },
  {
    title: 'Top-Notch Sarees & Service',
    name: 'Sunita Reddy',
    location: 'Hyderabad, India',
    rating: 5.0,
    text: 'KADHA is my all-time favorite destination for traditional and bridal sarees. The customer care team is extremely courteous, knowledgeable, and patient throughout the video call.'
  }
];

export default function Testimonials() {
  const sliderRef = useRef(null);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 360;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="kalyan-reviews-section" id="reviews-section">
      <div className="reviews-container">
        <div className="kalyan-section-header">
          <h2 className="kalyan-section-title">
            Customer <span className="gold-text">Stories</span>
          </h2>
        </div>

        <div className="reviews-slider-wrapper">
          <button 
            className="slider-btn left" 
            onClick={() => scroll('left')}
            aria-label="Scroll Left"
          >
            <ChevronLeft size={22} />
          </button>

          <div className="reviews-slider-track" ref={sliderRef}>
            {kalyanReviews.map((rev, idx) => (
              <div key={idx} className="kalyan-review-card">
                <div className="review-rating-row">
                  <div className="stars-wrap">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={14} fill="#EDF4C1" color="#EDF4C1" />
                    ))}
                  </div>
                  <span className="verified-badge">
                    <CheckCircle2 size={12} /> Verified Buyer
                  </span>
                </div>

                <Quote size={28} className="quote-icon" />

                <h3 className="review-title-text">{rev.title}</h3>
                <p className="review-body-text">"{rev.text}"</p>

                <div className="reviewer-profile">
                  <div className="reviewer-avatar">
                    {rev.name[0]}
                  </div>
                  <div className="reviewer-meta">
                    <h4 className="reviewer-name-str">{rev.name}</h4>
                    <span className="reviewer-loc-str">{rev.location}</span>
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
            <ChevronRight size={22} />
          </button>
        </div>
      </div>
    </section>
  );
}
