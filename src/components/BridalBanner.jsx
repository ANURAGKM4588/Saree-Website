import { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './BridalBanner.css';

gsap.registerPlugin(ScrollTrigger);

const totalFrames = 139;
const frameStart = 1000;
const BASE = import.meta.env.BASE_URL || '/';

const getFramePath = (index) =>
  `${BASE}images/bridalsaree/Woman_walking_with_lotus_flower_202606150000_${index}.jpg`;

const drawImageProp = (ctx, img, x, y, w, h, offsetX = 0.5, offsetY = 0) => {
  const iw = img.width;
  const ih = img.height;
  const r = Math.min(w / iw, h / ih);
  let nw = iw * r;
  let nh = ih * r;
  let cx, cy, cw, ch, ar = 1;

  if (nw < w) ar = w / nw;
  if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;
  nw *= ar;
  nh *= ar;

  cw = iw / (nw / w);
  ch = ih / (nh / h);

  cx = (iw - cw) * offsetX;
  cy = (ih - ch) * offsetY;

  if (cx < 0) cx = 0;
  if (cy < 0) cy = 0;
  if (cw > iw) cw = iw;
  if (ch > ih) ch = ih;

  ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
};

export default function BridalBanner() {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef({});
  const lastDrawnFrameRef = useRef(null);

  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const loadPercentage = Math.round((loadedCount / totalFrames) * 100);

  useEffect(() => {
    let loaded = 0;

    const preloadImages = async () => {
      const promises = Array.from({ length: totalFrames }, (_, i) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = getFramePath(frameStart + i);
          img.onload = () => {
            loaded++;
            setLoadedCount(loaded);
            imagesRef.current[frameStart + i] = img;
            resolve();
          };
          img.onerror = () => {
            loaded++;
            setLoadedCount(loaded);
            resolve();
          };
        });
      });

      await Promise.all(promises);
      setIsReady(true);
    };

    preloadImages();
  }, []);

  const drawFrame = (frameIndex) => {
    if (lastDrawnFrameRef.current === frameIndex) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = imagesRef.current[frameIndex];
    if (img && img.complete) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawImageProp(ctx, img, 0, 0, canvas.width, canvas.height);
      lastDrawnFrameRef.current = frameIndex;
    }
  };

  useLayoutEffect(() => {
    if (!isReady) return;

    const container = containerRef.current;
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!container || !wrapper || !canvas) return;

    // Set initial size
    const rect = wrapper.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    lastDrawnFrameRef.current = null;

    const frameObj = { val: frameStart };
    const mm = gsap.matchMedia();

    mm.add("(min-width: 769px)", () => {
      // DESKTOP: Full ScrollTrigger sequence
      drawFrame(frameStart);

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

      // Animate frame sequence
      tl.to(frameObj, {
        val: frameStart + totalFrames - 1,
        duration: 1,
        onUpdate: () => drawFrame(Math.round(frameObj.val)),
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

    mm.add("(max-width: 768px)", () => {
      // MOBILE: Static single banner (no scroll-timeline)
      // Render frame 1060 showing the bride centered in the frame
      drawFrame(frameStart + 60);
    });

    const handleResize = () => {
      if (!canvas || !wrapper) return;
      const r = wrapper.getBoundingClientRect();
      canvas.width = r.width;
      canvas.height = r.height;

      lastDrawnFrameRef.current = null; // Force redraw on resize

      if (window.innerWidth <= 768) {
        drawFrame(frameStart + 60);
      } else {
        const idx = Math.min(
          frameStart + totalFrames - 1,
          Math.max(frameStart, Math.round(frameObj.val))
        );
        drawFrame(idx);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mm.revert();
    };
  }, [isReady]);

  return (
    <div ref={containerRef} className="bridal-banner-scroll-container">
      {!isReady && (
        <div className="bb-preloader">
          <div className="bb-preloader-content">
            <span className="bb-preloader-logo">KADHA</span>
            <div className="bb-preloader-bar-wrapper">
              <div className="bb-preloader-bar" style={{ width: `${loadPercentage}%` }} />
            </div>
            <p className="bb-preloader-text">Loading Bridal Edit... {loadPercentage}%</p>
          </div>
        </div>
      )}

      {isReady && (
        <div ref={wrapperRef} className="bb-sticky-wrapper">
          <canvas ref={canvasRef} className="bb-canvas" />
          <div className="bb-canvas-overlay" />

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
      )}
    </div>
  );
}
