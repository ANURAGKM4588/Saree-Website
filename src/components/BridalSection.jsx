import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './BridalSection.css';

gsap.registerPlugin(ScrollTrigger);

const totalFrames = 139;
const frameStart = 1000;

const BASE = import.meta.env.BASE_URL || '/';

const getFramePath = (index) =>
  `${BASE}images/bridalsaree/Woman_walking_with_lotus_flower_202606150000_${index}.png`;

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

export default function BridalSection() {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef({});
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const promises = Array.from({ length: totalFrames }, (_, i) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = getFramePath(frameStart + i);
        img.onload = () => {
          imagesRef.current[frameStart + i] = img;
          resolve();
        };
        img.onerror = () => resolve();
      });
    });

    Promise.all(promises).then(() => setIsReady(true));
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

  useEffect(() => {
    if (!isReady) return;

    const container = containerRef.current;
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!container || !wrapper || !canvas) return;

    const rect = wrapper.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    drawFrame(frameStart);

    const tl = gsap.timeline({
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

    tl.to({}, {
      duration: 1,
      onUpdate: function () {
        const progress = this.progress();
        const idx = Math.min(
          frameStart + totalFrames - 1,
          Math.max(frameStart, Math.floor(progress * (totalFrames - 1)) + frameStart)
        );
        drawFrame(idx);
      },
    }, 0);

    tl.fromTo('.bridal-heading', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.10 }, 0);
    tl.to('.bridal-heading', { opacity: 0, y: -40, duration: 0.08 }, 0.90);

    tl.fromTo('.bridal-subtitle', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.08 }, 0.12);
    tl.to('.bridal-subtitle', { opacity: 0, y: -30, duration: 0.06 }, 0.40);

    tl.fromTo('.bridal-tagline', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.08 }, 0.50);
    tl.to('.bridal-tagline', { opacity: 0, y: -30, duration: 0.08 }, 1.0);

    const handleResize = () => {
      if (!canvas || !wrapper) return;
      const r = wrapper.getBoundingClientRect();
      canvas.width = r.width;
      canvas.height = r.height;
      const progress = tl.progress();
      const idx = Math.min(
        frameStart + totalFrames - 1,
        Math.max(frameStart, Math.floor(progress * (totalFrames - 1)) + frameStart)
      );
      drawFrame(idx);
    };

    window.addEventListener('resize', handleResize);
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener('resize', handleResize);
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [isReady]);

  return (
    <div ref={containerRef} className="bridal-scroll-container">
      <div ref={wrapperRef} className="bridal-sticky-wrapper">
        <canvas ref={canvasRef} className="bridal-canvas" />
        <div className="bridal-overlay" />

        <div className="bridal-text-overlay">
          <h2 className="bridal-heading">
            Every Bride Deserves<br />a Timeless Saree
          </h2>

          <p className="bridal-subtitle">For the day your story begins.</p>

          <p className="bridal-tagline">
            A whisper of gold, a lifetime of grace.
          </p>
        </div>
      </div>
    </div>
  );
}
