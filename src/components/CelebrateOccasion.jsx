import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import './CelebrateOccasion.css';

const BASE = import.meta.env.BASE_URL || '/';

const fabricCategories = [
  { name: 'Pure Silk', fabric: 'Pure Silk', image: `${BASE}images/sarees/folded-kanjivaram-silk-saree-green-golden-pallu.webp`, itemCounts: '120+ Designs' },
  { name: 'Cotton Sarees', fabric: 'Cotton', image: `${BASE}images/sarees/5_73_7415436e-9226-4442-9a42-d47387d04730.webp`, itemCounts: '85+ Designs' },
  { name: 'Tussar Sarees', fabric: 'Tussar', image: `${BASE}images/sarees/IMG20250515110716.jpg`, itemCounts: '64+ Designs' },
  { name: 'Georgette', fabric: 'Georgette', image: `${BASE}images/sarees/images (5).jpeg`, itemCounts: '90+ Designs' },
  { name: 'Vichitra Silk', fabric: 'Vichitra', image: `${BASE}images/sarees/images (6).jpeg`, itemCounts: '45+ Designs' },
  { name: 'Brocade Silk', fabric: 'Brocade', image: `${BASE}images/sarees/images (10).jpeg`, itemCounts: '110+ Designs' },
  { name: 'Organza', fabric: 'Organza', image: `${BASE}images/sarees/IMG20250515110716.jpg`, itemCounts: '75+ Designs' },
  { name: 'Ready to Wear', fabric: 'ReadyToWear', image: `${BASE}images/sarees/folded-kanjivaram-silk-saree-green-golden-pallu.webp`, itemCounts: '50+ Designs' }
];

export default function CelebrateOccasion() {
  const navigate = useNavigate();
  const sliderRef = useRef(null);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 280;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleFabricClick = (fabricName) => {
    navigate(`/products?search=${encodeURIComponent(fabricName)}`);
    window.scrollTo(0, 0);
  };

  return (
    <section className="kalyan-fabric-section" id="fabric-section">
      <div className="fabric-container">
        <div className="kalyan-section-header">
          <h2 className="kalyan-section-title">
            Shop By <span className="gold-text">Fabric</span>
          </h2>
        </div>

        <div className="fabric-slider-wrapper">
          <button 
            className="slider-arrow arrow-left" 
            onClick={() => scroll('left')}
            aria-label="Scroll Left"
          >
            <ChevronLeft size={22} />
          </button>

          <div className="fabrics-grid-slider" ref={sliderRef}>
            {fabricCategories.map((item, index) => (
              <div 
                key={index} 
                className="fabric-card"
                onClick={() => handleFabricClick(item.fabric)}
              >
                <div className="fabric-arch-frame">
                  <img src={item.image} alt={item.name} className="fabric-img" />
                  <div className="fabric-overlay">
                    <span className="fabric-count">{item.itemCounts}</span>
                    <button className="fabric-shop-btn">
                      Shop Now <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
                <h3 className="fabric-name">{item.name}</h3>
              </div>
            ))}
          </div>

          <button 
            className="slider-arrow arrow-right" 
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
