import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './CelebrateOccasion.css';

const BASE = import.meta.env.BASE_URL || '/';

const categoriesList = [
  { name: 'BANARASI', category: 'Banarasi', image: `${BASE}image/saree/5_73_7415436e-9226-4442-9a42-d47387d04730.webp` },
  { name: 'KANJEEVARAM', category: 'Kanjeevaram', image: `${BASE}image/saree/folded-kanjivaram-silk-saree-green-golden-pallu.webp` },
  { name: 'ORGANZA', category: 'Organza', image: `${BASE}image/saree/IMG20250515110716.jpg` },
  { name: 'PATOLA', category: 'Patola', image: `${BASE}image/saree/images (5).jpeg` },
  { name: 'MYSORE SILK', category: 'Mysore', image: `${BASE}image/saree/images (6).jpeg` },
  { name: 'PAITHANI', category: 'Paithani', image: `${BASE}image/saree/images (10).jpeg` }
];

export default function CelebrateOccasion() {
  const navigate = useNavigate();
  const sliderRef = useRef(null);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 240;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleCategoryClick = (catName) => {
    navigate(`/products?category=${catName}`);
  };

  return (
    <section className="celebrate-section">
      <div className="celebrate-container">
        <span className="celebrate-subtitle">CELEBRATE EVERY OCCASION IN STYLE</span>
        <h2 className="celebrate-title">
          Shop By <span className="gold-text">Category</span>
        </h2>

        <div className="slider-wrapper">
          <button 
            className="nav-btn left-btn" 
            onClick={() => scroll('left')}
            aria-label="Scroll Left"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="categories-slider" ref={sliderRef}>
            {categoriesList.map((cat, index) => (
              <div 
                key={index} 
                className="category-circle-card"
                onClick={() => handleCategoryClick(cat.category)}
              >
                <div className="circle-image-wrapper">
                  <img src={cat.image} alt={cat.name} className="circle-img" />
                </div>
                <span className="category-name">{cat.name}</span>
              </div>
            ))}
          </div>

          <button 
            className="nav-btn right-btn" 
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
