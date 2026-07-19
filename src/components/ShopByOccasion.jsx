import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ShopByOccasion.css';

const BASE = import.meta.env.BASE_URL || '/';

const occasions = [
  {
    id: 'wedding',
    title: 'The Wedding Edit',
    subtitle: 'Explore >',
    image: `${BASE}image/saree/folded-kanjivaram-silk-saree-green-golden-pallu.webp`,
    className: 'grid-item tall',
    filterUrl: '/products?category=Kanjeevaram'
  },
  {
    id: 'haldi',
    title: 'Haldi & Mehendi',
    subtitle: 'Shop Sangeet & Haldi >',
    image: `${BASE}image/saree/images (12).jpeg`,
    className: 'grid-item wide-top',
    filterUrl: '/products?category=Kota'
  },
  {
    id: 'cocktail',
    title: 'Cocktail Night',
    subtitle: 'Shop Sarees >',
    image: `${BASE}image/saree/IMG20250515110716.jpg`,
    className: 'grid-item narrow-top',
    filterUrl: '/products?category=Organza'
  },
  {
    id: 'festive',
    title: 'Festive Ready',
    subtitle: 'Shop Suits >',
    image: `${BASE}image/saree/5_73_7415436e-9226-4442-9a42-d47387d04730.webp`,
    className: 'grid-item narrow-bottom',
    filterUrl: '/products?category=Banarasi'
  },
  {
    id: 'casual',
    title: 'Casual Ethnic',
    subtitle: 'Shop Kurtis & Suits >',
    image: `${BASE}image/saree/images (9).jpeg`,
    className: 'grid-item wide-bottom',
    filterUrl: '/products?category=Chanderi'
  }
];

export default function ShopByOccasion() {
  const navigate = useNavigate();

  const handleCardClick = (url) => {
    navigate(url);
  };

  return (
    <section className="occasion-section">
      <div className="occasion-container">
        <h2 className="occasion-title">
          Shop By <span className="gold-text">Occasion</span>
        </h2>
        
        <div className="occasion-grid">
          {occasions.map((occ) => (
            <div 
              key={occ.id} 
              className={`occasion-card ${occ.className}`}
              onClick={() => handleCardClick(occ.filterUrl)}
            >
              <div className="occasion-img-wrapper">
                <img src={occ.image} alt={occ.title} className="occasion-img" />
                <div className="occasion-overlay" />
              </div>
              <div className="occasion-content">
                <h3 className="occasion-card-title">{occ.title}</h3>
                <span className="occasion-card-subtitle">{occ.subtitle}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
