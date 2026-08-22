import { useState, useEffect, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import heroBanner from "@/assets/hero-banner.jpg";
import { formatPrice } from "@/data/sarees";
import { ArrowRight, Sparkles, ArrowUpRight } from "lucide-react";

type MinimalSlide = {
  id: string;
  tag: string;
  headline: string;
  italicText: string;
  description: string;
  image: string;
  sareeName: string;
  price: number;
  slug: string;
};

const slides: MinimalSlide[] = [
  {
    id: "01",
    tag: "Festive Edit 2026",
    headline: "Woven in Kerala.",
    italicText: "Considered, slow, timeless.",
    description:
      "Handcrafted on pitlooms with pure mulberry silk & real zari. Delivered with a complimentary attached blouse piece.",
    image: hero1,
    sareeName: "Emerald Kanjivaram Silk",
    price: 3499,
    slug: "yellow-teal-mulmul-cotton-saree",
  },
  {
    id: "02",
    tag: "Chettinad Cottons",
    headline: "Everyday Drape.",
    italicText: "Quiet, effortless luxury.",
    description:
      "Breathable handspun cotton checks with woven gold borders. Designed for all-day comfort in tropical warmth.",
    image: hero2,
    sareeName: "Coffee & Kumkum Chettinad",
    price: 3299,
    slug: "mustard-yellow-sungudi-cotton-saree",
  },
  {
    id: "03",
    tag: "Handloom Ikat",
    headline: "Loom to Door.",
    italicText: "Artisanal craft, small batch.",
    description:
      "Featherlight ikat handloom sarees resist-dyed by traditional weaver families. Insured shipping across India.",
    image: hero3,
    sareeName: "Ivory Ikat Mulmul Saree",
    price: 2999,
    slug: "white-ikat-mulmul-saree",
  },
  {
    id: "04",
    tag: "Bridal Signature",
    headline: "Pure Pitloom.",
    italicText: "Made to last a lifetime.",
    description:
      "Limited batch handwoven silks crafted with ancient Kerala techniques. Book online in 2 minutes.",
    image: heroBanner,
    sareeName: "Turmeric Gold Bridal Silk",
    price: 3799,
    slug: "orange-sungudi-cotton-saree",
  },
];

export function HeroSectionOption5() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      next();
    }, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const active = slides[current];

  return (
    <section className="mx-auto max-w-[1400px] px-4 pt-4 sm:pt-6 lg:px-8">
      {/* MINIMAL & MODERN CONTAINER */}
      <div className="relative min-h-[560px] sm:min-h-[620px] lg:min-h-[680px] overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-cream/80 via-background to-background border border-border/60 p-6 sm:p-12 lg:p-16 flex flex-col justify-between shadow-2xs">
        
        {/* TOP MINIMAL BAR */}
        <div className="flex items-center justify-between border-b border-border/60 pb-6">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-gold" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-soft">
              Kadha Handloom House · {active.tag}
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs font-semibold text-muted-foreground">
            <span className="text-foreground">{active.id}</span>
            <span>/</span>
            <span>04</span>
          </div>
        </div>

        {/* MAIN MINIMAL GRID */}
        <div className="my-8 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          
          {/* LEFT: MINIMAL EDITORIAL TYPOGRAPHY */}
          <div className="space-y-6 lg:col-span-7">
            <div className="min-h-[140px] sm:min-h-[180px] transition-all duration-500">
              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-semibold leading-[1.02] tracking-[-0.03em] text-brand-soft">
                {active.headline}
                <br />
                <span className="font-serif italic font-normal text-gold">
                  {active.italicText}
                </span>
              </h1>
            </div>

            <p className="max-w-lg text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal">
              {active.description}
            </p>

            {/* MINIMAL CTA BUTTONS */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to="/shop/$slug"
                params={{ slug: active.slug }}
                className="inline-flex items-center justify-center gap-3 rounded-full bg-brand px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground shadow-md hover:bg-brand-soft transition-all cursor-pointer group"
              >
                <span>Shop This Saree ({formatPrice(active.price)})</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border bg-card px-7 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-foreground hover:border-gold hover:text-brand transition-all cursor-pointer"
              >
                <span>View Catalog</span>
                <ArrowUpRight className="h-4 w-4 text-gold" />
              </Link>
            </div>
          </div>

          {/* RIGHT: CLEAN PORTRAIT SHOWCASE IMAGE */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative aspect-[3/4] w-full max-w-[380px] overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)]">
              {slides.map((s, idx) => (
                <div
                  key={s.id}
                  className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                    idx === current ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                  }`}
                >
                  <img
                    src={s.image}
                    alt={s.sareeName}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                </div>
              ))}

              {/* Minimal Floating Caption */}
              <div className="absolute bottom-5 left-5 right-5 z-20 rounded-2xl bg-card/90 border border-border/80 p-3.5 backdrop-blur-md shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display text-xs font-semibold text-foreground truncate">{active.sareeName}</p>
                    <p className="text-[10px] text-emerald-800 font-medium">✂️ Attached Blouse Included</p>
                  </div>
                  <span className="font-display text-xs font-bold text-gold tabular-nums">
                    {formatPrice(active.price)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM MINIMAL PROGRESS BAR & CONTROLS */}
        <div className="flex items-center justify-between border-t border-border/60 pt-6">
          {/* Minimal Slide Indicators */}
          <div className="flex items-center gap-3">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrent(idx)}
                className={`h-1.5 transition-all cursor-pointer rounded-full ${
                  idx === current ? "w-10 bg-brand" : "w-3 bg-border hover:bg-gold/60"
                }`}
                aria-label={`Go to slide ${s.id}`}
              />
            ))}
          </div>

          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-gold" /> Free Kerala Insured Express Delivery
          </div>
        </div>
      </div>
    </section>
  );
}
