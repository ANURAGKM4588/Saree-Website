import React from 'react';
import { Crown, ShieldCheck, Video, Globe2, RefreshCw } from 'lucide-react';
import './TrustBenefits.css';

const kalyanTrustBadges = [
  {
    icon: Crown,
    title: '100+ YEARS HERITAGE',
    desc: 'World’s largest silk showroom network since 1909'
  },
  {
    icon: ShieldCheck,
    title: 'SILK MARK CERTIFIED',
    desc: 'Guaranteed 100% pure Mulberry & Kanjivaram silk'
  },
  {
    icon: Video,
    title: 'LIVE VIDEO SHOPPING',
    desc: 'Personalized virtual store tour on WhatsApp (+91 81299 66333)'
  },
  {
    icon: Globe2,
    title: 'WORLDWIDE EXPRESS SHIPPING',
    desc: 'Safe & tracked doorstep delivery across 60+ countries'
  },
  {
    icon: RefreshCw,
    title: 'EASY RETURNS & FITTING',
    desc: 'Hassle-free 7-day returns & custom blouse stitching service'
  }
];

export default function TrustBenefits() {
  return (
    <section className="kalyan-trust-section">
      <div className="trust-container">
        <div className="trust-badges-grid">
          {kalyanTrustBadges.map((b, index) => (
            <div key={index} className="trust-card">
              <div className="trust-icon-box">
                <b.icon size={26} className="trust-icon" />
              </div>
              <h3 className="trust-card-title">{b.title}</h3>
              <p className="trust-card-desc">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
