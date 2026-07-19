import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './BridalBanner.css';

gsap.registerPlugin(ScrollTrigger);

const BASE = import.meta.env.BASE_URL || '/';

export default function BridalBanner() {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const wrapper = wrapperRef.current;
    if (!container || !wrapper) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 769px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          pin: wrapper,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
        defaults: { ease: 'none' },
      });

      // Animate background image parallax zoom
      tl.to('.bb-bg-image', {
        scale: 1.12,
        duration: 1,
      }, 0);

      // Phase 1 text: "THE BRIDAL EDIT" & "For the Day Your Story Begins"
      // Visible at start, fades out
      gsap.set('.bb-phase-1', { opacity: 1, y: 0 });
      tl.to('.bb-phase-1', { opacity: 0, y: -40, duration: 0.15 }, 0.15);

      // Phase 2 text: "Discover our exclusive collection..."
      // Fades in, then fades out
      gsap.set('.bb-phase-2', { opacity: 0, y: 40 });
      tl.to('.bb-phase-2', { opacity: 1, y: 0, duration: 0.15 }, 0.25);
      tl.to('.bb-phase-2', { opacity: 0, y: -40, duration: 0.15 }, 0.50);

      // Phase 3 text: "Each piece is handpicked..." & "Explore Bridal Collection" Button
      // Fades in, stays visible till end
      gsap.set('.bb-phase-3', { opacity: 0, y: 40 });
      tl.to('.bb-phase-3', { opacity: 1, y: 0, duration: 0.15 }, 0.62);
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="bridal-banner-scroll-container">
      <div ref={wrapperRef} className="bb-sticky-wrapper">
        <div className="bb-background-container">
          <img 
            src={`${BASE}image/saree/5_73_7415436e-9226-4442-9a42-d47387d04730.webp`} 
            alt="Bridal Saree Detail" 
            className="bb-bg-image" 
          />
          <div className="bb-canvas-overlay" />
        </div>

        {/* Phase 1 Overlay */}
        <div className="bb-text-overlay bb-phase-1">
          <span className="bb-tag">THE BRIDAL EDIT</span>
          <h2 className="bb-heading">
            For the Day Your<br />Story Begins
          </h2>
        </div>

        {/* Phase 2 Overlay */}
        <div className="bb-text-overlay bb-phase-2">
          <p className="bb-desc">
            Discover our exclusive collection of bridal silks, where tradition meets timeless elegance.
          </p>
        </div>

        {/* Phase 3 Overlay */}
        <div className="bb-text-overlay bb-phase-3">
          <p className="bb-desc-tagline">
            Each piece is handpicked for the discerning bride.
          </p>
          <div className="bb-cta-wrapper">
            <Link to="/products" className="bb-cta">
              Explore Bridal Collection <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Mobile Unified Overlay (Only visible on mobile) */}
        <div className="bb-text-overlay bb-mobile-unified">
          <span className="bb-tag">THE BRIDAL EDIT</span>
          <h2 className="bb-heading">
            For the Day Your<br />Story Begins
          </h2>
          <p className="bb-desc">
            Discover our exclusive collection of bridal silks, where tradition meets timeless elegance.
          </p>
          <div className="bb-cta-wrapper">
            <Link to="/products" className="bb-cta">
              Explore Bridal Collection <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
