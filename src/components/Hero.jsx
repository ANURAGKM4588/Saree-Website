import { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

const totalFrames = 224;

const getFramePath = (index) => {
  const BASE = import.meta.env.BASE_URL || '/';
  const paddedIndex = String(index).padStart(3, '0');
  return `${BASE}images/herosection/ChatGPT Image Jun 14, 2026, 02_54_17 PM${paddedIndex}.png`;
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
        return new Promise((resolve) => {
          const img = new Image();
          img.src = getFramePath(i + 1);
          img.onload = () => {
            loaded++;
            setLoadedCount(loaded);
            imagesRef.current[i + 1] = img;
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
    drawFrame(1);

    // Hard block user manual scroll events during intro
    const preventScroll = (e) => {
      e.preventDefault();
    };

    // Disable scroll restoration and lock scroll during intro
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });

    let scrollTl = null;
    let entryTl = null;
    const frObj = { val: 1 };
    const introFrames = 50;

    const ctx = gsap.context(() => {
      // ---- Auto entry animation ----
      entryTl = gsap.timeline({ ease: 'none', paused: true });

      // Frame animation: pallu floats upward (frames 1 → 50)
      entryTl.to(frObj, {
        val: introFrames,
        duration: 3.5,
        ease: 'power2.out',
        onUpdate: () => drawFrame(Math.round(frObj.val)),
      }, 0);

      // Phase 1 text appears together after a brief pause
      entryTl.fromTo('.phase-1', { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 1.4, ease: 'power2.out',
      }, 0.8);

      // Scroll indicator fades in at the end of the entry animation
      entryTl.fromTo('.scroll-indicator', { opacity: 0 }, {
        opacity: 1, duration: 0.8, ease: 'power2.out',
      }, 2.5);

      // Hold at end of entry
      entryTl.to({}, { duration: 0.5 });

      entryTl.eventCallback('onComplete', () => {
        // Unlock scroll and initialize scroll timeline
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        window.removeEventListener('wheel', preventScroll);
        window.removeEventListener('touchmove', preventScroll);
        if (!scrollTl) initScrollTl();
      });

      // Play intro animation
      entryTl.play();
    }, container);

    function initScrollTl() {
      const currentStartFrame = Math.round(frObj.val);
      const frameObj2 = { val: currentStartFrame };

      // Ensure phase-1 is at its active state at the start of scroll Trigger
      gsap.set('.phase-1', { opacity: 1, y: 0 });

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
        val: totalFrames,
        duration: 1,
        onUpdate: () => drawFrame(Math.round(frameObj2.val)),
      }, 0);

      // Phase 1: hold briefly, then fade out (Phase 2 starts fading in during this time)
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

      // Phase 5
      scrollTl.fromTo(
        '.phase-5',
        { opacity: 0, scale: 0.95, letterSpacing: '0.1em' },
        { opacity: 1, scale: 1.05, letterSpacing: '0.3em', duration: 0.20 },
        0.80
      );

      scrollTl.to('.scroll-indicator', { opacity: 0, duration: 0.03 }, 0);

      ScrollTrigger.refresh();
    }

    const handleResize = () => {
      const canvas = canvasRef.current;
      const wrapper = wrapperRef.current;
      if (!canvas || !wrapper) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      if (scrollTl) {
        const progress = scrollTl.progress();
        const startFrame = Math.round(frObj.val);
        const fi = startFrame + Math.floor(progress * (totalFrames - startFrame));
        drawFrame(Math.min(totalFrames, fi));
      } else {
        const fi = Math.min(introFrames, Math.round(frObj.val));
        drawFrame(fi);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
      entryTl.kill();
      ctx.revert();
    };
  }, [isReady]);

  return (
    <div ref={containerRef} className="hero-scroll-container">
      {!isReady && (
        <div className="hero-preloader">
          <div className="preloader-content">
            <span className="preloader-logo">ZARI</span>
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
          <div className="hero-text-overlay phase-center phase-1">
            <span className="hero-tagline">THE CRAFT OF SILK</span>
            <h1 className="hero-title">SUTRA</h1>
            <p className="hero-subtext">A scroll-driven cinematic weave.</p>
          </div>

          {/* Phase 2: Feature 1 - Mulberry Warp */}
          <div className="hero-text-overlay feature-card left-callout phase-2">
            <span className="feature-num">01</span>
            <h3 className="feature-title">The Mulberry Warp</h3>
            <p className="feature-body">
              Hand-selected Mulberry silk filaments are twisted together to create
              a warp of high tensile strength and deep dye affinity, giving Zari sarees
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
            <h3 className="feature-title">300 Hours of Devotion</h3>
            <p className="feature-body">
              Every millimeter is woven manually on traditional pit looms. A slow,
              deliberate heartbeat of heritage and muscular memory.
            </p>
          </div>

          {/* Phase 5: Final Brand Reveal */}
          <div className="hero-text-overlay phase-center phase-5">
            <h2 className="hero-brand-name">ZARI</h2>
            <p className="hero-subtext">Heritage Weaves. Tailored for Eternity.</p>
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
