import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Image, Globe, MessageCircle, Video, Mail, MapPin, Phone } from 'lucide-react';
import './Footer.css';

const footerSections = [
  {
    title: 'About',
    items: [
      { label: 'Our Story', href: '#story' },
      { label: 'Craftsmanship', href: '#' },
      { label: 'Our Weavers', href: '#' },
      { label: 'Sustainability', href: '#' },
    ],
  },
  {
    title: 'Collections',
    items: [
      { label: 'Banarasi', href: '/products' },
      { label: 'Kanjeevaram', href: '/products' },
      { label: 'Organza', href: '/products' },
      { label: 'Bridal Edit', href: '/products' },
    ],
  },
  {
    title: 'Policies',
    items: [
      { label: 'Shipping', href: '#' },
      { label: 'Returns & Exchange', href: '#' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
    ],
  },
  {
    title: 'Contact',
    items: [
      { label: 'hello@zariheritage.com', href: 'mailto:hello@zariheritage.com', icon: Mail },
      { label: '+91 1800-123-4567', href: 'tel:+9118001234567', icon: Phone },
      { label: 'Mumbai, Maharashtra, India', href: '#', icon: MapPin },
    ],
  },
];

const socialLinks = [
  { icon: Image, href: 'https://instagram.com/zari_heritage' },
  { icon: Globe, href: '#' },
  { icon: MessageCircle, href: '#' },
  { icon: Video, href: '#' },
];

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer-inner">
        <div className="footer-top">
          {/* Brand Column */}
          <div className="footer-brand">
            <h2 className="footer-logo">ZARI</h2>
            <p className="footer-brand-desc">
              Heritage weaves crafted by India's finest master weavers. Every thread tells a story of tradition, patience, and unparalleled artistry.
            </p>
            <div className="footer-social">
              {socialLinks.map((s, index) => (
                <a
                  key={index}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link"
                >
                  <s.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {footerSections.map((section) => (
            <div key={section.title} className="footer-col">
              <h4 className="footer-col-title">{section.title}</h4>
              <ul className="footer-links">
                {section.items.map((item) => (
                  <li key={item.label}>
                    {item.href.startsWith('http') || item.href.startsWith('mailto') || item.href.startsWith('tel') ? (
                      <a href={item.href} className="footer-link">
                        {item.icon && <item.icon size={14} />}
                        {item.label}
                      </a>
                    ) : item.href.startsWith('#') ? (
                      <a href={item.href} className="footer-link">
                        {item.icon && <item.icon size={14} />}
                        {item.label}
                      </a>
                    ) : (
                      <Link to={item.href} className="footer-link">
                        {item.icon && <item.icon size={14} />}
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 Zari Heritage Loom. All rights reserved.</p>
          <p className="footer-bottom-tagline">Handwoven with devotion. Draped with pride.</p>
        </div>
      </div>
    </footer>
  );
}
