import React from 'react';
import { Link } from 'react-router-dom';
import './BridalBanner.css';

const BASE = import.meta.env.BASE_URL || '/';

export default function BridalBanner() {
  return (
    <section className="raj-gharana-section" id="bridal-section">
      <div className="raj-gharana-banner-container">
        {/* Banner Image */}
        <img 
          src={`${BASE}image/raj_gharana_banner.png`} 
          alt="Raj Gharana New Collection" 
          className="raj-gharana-bg-image"
          onError={(e) => {
            e.target.src = `${BASE}images/sarees/folded-kanjivaram-silk-saree-green-golden-pallu.webp`;
          }}
        />

        {/* Gradient Overlay for text readability */}
        <div className="raj-gharana-gradient-overlay" />

        {/* Right-Aligned Text Content Container matching reference design */}
        <div className="raj-gharana-content-right">
          {/* Circular Logo Emblem */}
          <div className="rg-logo-emblem">
            <svg viewBox="0 0 100 100" className="rg-emblem-svg">
              <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="1" />
              <path d="M50 18 L58 30 L72 32 L62 42 L64 56 L50 48 L36 56 L38 42 L28 32 L42 30 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <path d="M30 65 Q50 58 70 65" fill="none" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            <span className="rg-emblem-text">KADHA SILKS</span>
          </div>

          {/* Large Regal Serif Title */}
          <h2 className="rg-title">
            Raj<br />Gharana
          </h2>

          {/* Subtitle */}
          <p className="rg-subtitle">Unveiling Our New Collection</p>

          {/* Tagline */}
          <p className="rg-tagline">REGAL. REFINED. REMARKABLE.</p>

          {/* Red Pill Button */}
          <Link to="/products?category=Bridal" className="rg-explore-btn">
            EXPLORE NOW
          </Link>
        </div>
      </div>
    </section>
  );
}
