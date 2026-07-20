import { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

const totalFrames = 241;
const startFrameNum = 5;
const endFrameNum = startFrameNum + totalFrames - 1; // 245

const getFramePath = (index) => {
  const BASE = import.meta.env.BASE_URL || '/';
  const paddedIndex = String(index).padStart(3, '0');
  return `${BASE}image/herosection/new_webp/hf_20260718_194543_38905dcd-3226-421c-a8f2-a4fdd40e1b9f${paddedIndex}.webp`;
};

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

export default function Hero() {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef({});

  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const loadPercentage = Math.round((loadedCount / totalFrames) * 100);

  useEffect(() => {
    let loaded = 0;

    const preloadImages = async () => {
      const promises = Array.from({ length: totalFrames }, (_, i) => {
        const frameNum = startFrameNum + i;
        return new Promise((resolve) => {
          const img = new Image();
          img.src = getFramePath(frameNum);
          img.onload = () => {
            loaded++;
            setLoadedCount(loaded);
            imagesRef.current[frameNum] = img;
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
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = imagesRef.current[frameIndex];
    if (img && img.complete) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawImageProp(ctx, img, 0, 0, canvas.width, canvas.height);
    }
  };

  useLayoutEffect(() => {
    if (!isReady) return;

    const container = containerRef.current;
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!container || !wrapper || !canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawFrame(startFrameNum);

    let scrollTl = null;

    const ctx = gsap.context(() => {
      // Ensure phase-1 text is visible instantly on load complete
      gsap.set('.phase-1', { opacity: 1, y: 0 });
      gsap.set('.scroll-indicator', { opacity: 1 });

      const frameObj2 = { val: startFrameNum };

      // Initialize scrollTrigger immediately
      scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          pin: wrapper,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          invalidateOnRefresh: true,
        },
        defaults: { ease: 'none' },
      });

      scrollTl.to(frameObj2, {
        val: endFrameNum,
        duration: 1,
        onUpdate: () => drawFrame(Math.round(frameObj2.val)),
      }, 0);

      // Phase 1: hold briefly, then fade out
      scrollTl.to('.phase-1', { opacity: 0, y: -30, duration: 0.12 }, 0.03);

      // Phase 2: fade in overlapping with Phase 1 fade out
      scrollTl.fromTo('.phase-2', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.12 }, 0);
      scrollTl.to('.phase-2', { opacity: 0, y: -30, duration: 0.08 }, 0.25);

      // Phase 3
      scrollTl.fromTo('.phase-3', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.12 }, 0.30);
      scrollTl.to('.phase-3', { opacity: 0, y: -30, duration: 0.08 }, 0.50);

      // Phase 4
      scrollTl.fromTo('.phase-4', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.12 }, 0.55);
      scrollTl.to('.phase-4', { opacity: 0, y: -30, duration: 0.08 }, 0.75);

      // Phase 5: Final Brand Reveal
      scrollTl.fromTo(
        '.phase-5',
        { opacity: 0 },
        { opacity: 1, duration: 0.18, ease: 'power2.out' },
        0.80
      );

      scrollTl.to('.scroll-indicator', { opacity: 0, duration: 0.03 }, 0);

      // Force immediate refresh so scrolling works instantly
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 50);
    }, container);

    const handleResize = () => {
      const canvas = canvasRef.current;
      const wrapper = wrapperRef.current;
      if (!canvas || !wrapper) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      if (scrollTl) {
        const progress = scrollTl.progress();
        const fi = startFrameNum + Math.floor(progress * (endFrameNum - startFrameNum));
        drawFrame(Math.min(endFrameNum, fi));
      } else {
        drawFrame(startFrameNum);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      ctx.revert();
    };
  }, [isReady]);

  return (
    <div ref={containerRef} className="hero-scroll-container">
      {!isReady && (
        <div className="hero-preloader">
          <div className="preloader-content">
            <img src="/logo/loading page logo.png" alt="Kadha Logo" className="preloader-logo-img" />
            <div className="preloader-bar-wrapper">
              <div className="preloader-bar" style={{ width: `${loadPercentage}%` }} />
            </div>
            <p className="preloader-text">Winding the Warp... {loadPercentage}%</p>
          </div>
        </div>
      )}

      {isReady && (
        <div ref={wrapperRef} className="hero-sticky-wrapper">
          <canvas ref={canvasRef} className="hero-canvas" />
          <div className="hero-overlay-gradient" />

          {/* Phase 1: Brand Introduction */}
          <div className="hero-text-overlay phase-left phase-1">
            <span className="hero-tagline">THE CRAFT OF SILK</span>
            <h1 className="hero-title">Where Heritage<br/>Meets Weave</h1>
            <div className="hero-divider">
              <span className="hero-divider-diamond">◆</span>
            </div>
            <p className="hero-subtext">Discover timeless Banarasi, Organza and Silk Sarees crafted by skilled artisans for every celebration.</p>
            <div className="hero-buttons">
              <a href="#collections" className="hero-btn hero-btn-primary">Explore Collections ›</a>
              <a href="#story" className="hero-btn hero-btn-secondary">Our Story</a>
            </div>
          </div>

          {/* Phase 2: Feature 1 - Mulberry Warp */}
          <div className="hero-text-overlay feature-card left-callout phase-2">
            <span className="feature-num">01</span>
            <h3 className="feature-title">The Mulberry Warp</h3>
            <p className="feature-body">
              Hand-selected Mulberry silk filaments are twisted together to create
              a warp of high tensile strength and deep dye affinity, giving Kadha sarees
              their fluid drape.
            </p>
          </div>

          {/* Phase 3: Feature 2 - 24K Gold Zari */}
          <div className="hero-text-overlay feature-card right-callout phase-3">
            <span className="feature-num">02</span>
            <h3 className="feature-title">24K Gold Zari</h3>
            <p className="feature-body">
              Metallic silver threads are spun, wrapped in pure gold, and interlaid
              directly into the silk warp to refract warm light and produce glowing heritage motifs.
            </p>
          </div>

          {/* Phase 4: Feature 3 - 300 Hours */}
          <div className="hero-text-overlay feature-card left-callout phase-4">
            <span className="feature-num">03</span>
            <h3 className="feature-title">300 Devoted Hours</h3>
            <p className="feature-body">
              Every millimeter is woven manually on traditional pit looms. A slow,
              deliberate heartbeat of heritage and muscular memory.
            </p>
          </div>

          {/* Phase 5: Final Brand Reveal */}
          <div className="hero-text-overlay phase-center phase-5">
            <img src="/logo/herologo.png" alt="Kadha Logo" className="hero-brand-logo-img" />
          </div>

          {/* Scroll down indicator */}
          <div className="scroll-indicator">
            <span className="indicator-text">Scroll to weave</span>
            <div className="mouse-wheel">
              <div className="wheel-dot" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
