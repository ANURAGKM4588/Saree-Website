import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import './ShopByOccasion.css';

const BASE = import.meta.env.BASE_URL || '/';

const kalyanOccasions = [
  {
    id: 'wedding',
    title: 'Weddings & Grand Events',
    description: 'Opulent Kanjivaram & Banarasi Pure Silk Sarees',
    badge: 'Bridal Heritage',
    image: `${BASE}images/sarees/folded-kanjivaram-silk-saree-green-golden-pallu.webp`,
    className: 'grid-item-main',
    filterUrl: '/products?category=Kanjeevaram'
  },
  {
    id: 'festive',
    title: 'Festive & Onam Celebrations',
    description: 'Set Sarees & Handpicked Golden Pallus',
    badge: 'Tradition',
    image: `${BASE}images/sarees/5_73_7415436e-9226-4442-9a42-d47387d04730.webp`,
    className: 'grid-item-side-top',
    filterUrl: '/products?category=Banarasi'
  },
  {
    id: 'evenings',
    title: 'Evenings & Celebrations',
    description: 'Designer Organza & Shimmer Brocades',
    badge: 'Cocktail Elegance',
    image: `${BASE}images/sarees/IMG20250515110716.jpg`,
    className: 'grid-item-side-bottom1',
    filterUrl: '/products?category=Organza'
  },
  {
    id: 'workwear',
    title: 'Work & Everyday Grace',
    description: 'Breathable Pure Cotton & Soft Linen Weaves',
    badge: 'Daily Luxury',
    image: `${BASE}images/sarees/images (9).jpeg`,
    className: 'grid-item-side-bottom2',
    filterUrl: '/products?category=Chanderi'
  }
];

export default function ShopByOccasion() {
  const navigate = useNavigate();

  return (
    <section className="kalyan-occasion-section" id="occasion-section">
      <div className="occasion-container">
        <div className="kalyan-section-header">
          <h2 className="kalyan-section-title">
            Curated <span className="gold-text">Occasions</span>
          </h2>
        </div>
        
        <div className="kalyan-occasion-grid">
          {kalyanOccasions.map((occ) => (
            <div 
              key={occ.id}
              className={`occasion-tile ${occ.className}`}
              onClick={() => {
                navigate(occ.filterUrl);
                window.scrollTo(0, 0);
              }}
            >
              <div className="tile-img-container">
                <img src={occ.image} alt={occ.title} className="tile-img" />
                <div className="tile-gradient-overlay" />
              </div>
              
              <div className="tile-badge">
                <Sparkles size={11} /> {occ.badge}
              </div>

              <div className="tile-info">
                <h3 className="tile-title">{occ.title}</h3>
                <p className="tile-desc">{occ.description}</p>
                <button className="tile-cta">
                  Explore Edit <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
