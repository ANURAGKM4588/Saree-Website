import React from 'react';
import { Award, Sparkles, Truck, RotateCcw, Lock } from 'lucide-react';
import './TrustBenefits.css';

const benefits = [
  {
    icon: Award,
    title: 'AUTHENTIC QUALITY',
    desc: 'Handpicked premium fabrics and trusted craftsmanship you can rely on.'
  },
  {
    icon: Sparkles,
    title: 'MODERN TRADITION',
    desc: 'Designs that blend timeless Indian heritage with contemporary elegance.'
  },
  {
    icon: Truck,
    title: 'EXPRESS DELIVERY',
    desc: 'Fast shipping across India with secure packaging and tracking.'
  },
  {
    icon: RotateCcw,
    title: 'EASY RETURNS',
    desc: '7-day hassle-free returns and exchange policy for your peace of mind.'
  },
  {
    icon: Lock,
    title: '100% SECURE PAYMENT',
    desc: 'Safe payment gateways ensuring your data privacy.'
  }
];

export default function TrustBenefits() {
  return (
    <section className="trust-benefits-section">
      <div className="trust-benefits-container">
        <div className="benefits-row">
          {benefits.map((b, index) => (
            <div key={index} className="benefit-col">
              <div className="benefit-icon-wrapper">
                <b.icon size={22} className="benefit-icon" />
              </div>
              <h3 className="benefit-title">{b.title}</h3>
              <p className="benefit-desc">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
