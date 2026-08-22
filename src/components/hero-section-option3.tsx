import { useState, useEffect, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import heroBanner from "@/assets/hero-banner.jpg";
import { formatPrice } from "@/data/sarees";
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight, Play, Award } from "lucide-react";

type Slide = {
  id: number;
  category: string;
  title: string;
  subtitle: string;
  price: number;
  weaver: string;
  location: string;
  image: string;
  slug: string;
};

const slides: Slide[] = [
  {
    id: 1,
    category: "Kanjivaram Pitloom Silk",
    title: "Handwoven Royal Kanjivaram",
    subtitle: "Pure Mulberry Silk · Real Zari Borders · Kerala Studio",
    price: 3499,
    weaver: "Master Artisan Ramanathan",
    location: "Kanchipuram Looms",
    image: hero1,
    slug: "yellow-teal-mulmul-cotton-saree",
  },
  {
    id: 2,
    category: "Chettinad Heritage Cotton",
    title: "Coffee & Kumkum Chettinad",
    subtitle: "Breathable Handspun Checks · Lightweight All-Day Comfort",
    price: 3299,
    weaver: "Artisan Lakshmi Amma",
    location: "Chettinad Looms",
    image: hero2,
    slug: "mustard-yellow-sungudi-cotton-saree",
  },
  {
    id: 3,
    category: "Mulmul Resist-Dyed Ikat",
    title: "Featherlight Handloom Ikat",
    subtitle: "Precision Resist-Dyed Yarns · Soft Natural Dyes",
    price: 2999,
    weaver: "Master Weaver Devdas",
    location: "Pochampally Looms",
    image: hero3,
    slug: "white-ikat-mulmul-saree",
  },
  {
    id: 4,
    category: "Bridal Signature Weaves",
    title: "Turmeric Gold Silk Edition",
    subtitle: "Limited 12-Piece Batch · Attached Blouse Piece Included",
    price: 3799,
    weaver: "Master Weaver Sundaram",
    location: "Kumbakonam Studio",
    image: heroBanner,
    slug: "orange-sungudi-cotton-saree",
  },
];

export function HeroSectionOption3() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      next();
    }, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];
  const nextSlide = slides[(current + 1) % slides.length];

  return (
    <section className="mx-auto max-w-[1400px] px-4 pt-4 lg:px-8">
      <div className="relative min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] overflow-hidden rounded-[2.5rem] bg-slate-950 text-white shadow-2xl">
        {/* Background Ken-Burns Images */}
        {slides.map((s, idx) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
              idx === current ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <img
              src={s.image}
              alt={s.title}
              className={`h-full w-full object-cover transition-transform duration-[9000ms] ease-out ${
                idx === current ? "scale-105" : "scale-100"
              }`}
            />
            {/* Cinematic Gradient Masking */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-slate-950/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
          </div>
        ))}

        {/* TOP BAR OVERLAY */}
        <div className="relative z-20 flex items-center justify-between px-6 pt-6 sm:px-12 sm:pt-8">
          <div className="flex items-center gap-3">
            <span className="flex h-7 items-center justify-center rounded-full bg-gold/20 px-3.5 text-[10px] font-bold uppercase tracking-[0.2em] text-gold border border-gold/40">
              ATELIER BATCH #2026
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-white/70">
              <Award className="h-3.5 w-3.5 text-gold" /> Certified Handloom Authentic
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prev}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/30 cursor-pointer backdrop-blur-md"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/30 cursor-pointer backdrop-blur-md"
              aria-label="Next Slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="relative z-20 grid h-full min-h-[500px] grid-cols-1 items-end px-6 pb-12 sm:px-12 sm:pb-14 lg:grid-cols-12">
          {/* LEFT: Editorial Story Content */}
          <div className="space-y-5 lg:col-span-8">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-gold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{slide.category}</span>
            </div>

            <h1 className="font-display text-4xl font-semibold leading-[1.02] tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl drop-shadow-md">
              {slide.title}
            </h1>

            <p className="max-w-xl text-xs sm:text-sm text-white/80 leading-relaxed font-light">
              {slide.subtitle} — Hand-crafted by <strong>{slide.weaver}</strong> at {slide.location}.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-3">
              <Link
                to="/shop/$slug"
                params={{ slug: slide.slug }}
                className="inline-flex items-center justify-center gap-3 rounded-full bg-gold px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-brand-soft shadow-lg hover:bg-gold-soft transition-all group cursor-pointer"
              >
                <span>View Saree ({formatPrice(slide.price)})</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-white/20 transition-all backdrop-blur-md cursor-pointer"
              >
                Explore Full Catalog
              </Link>
            </div>
          </div>

          {/* RIGHT: Upcoming Slide Preview Card Stack */}
          <div className="hidden lg:col-span-4 lg:flex flex-col items-end">
            <div
              onClick={next}
              className="group relative w-64 cursor-pointer overflow-hidden rounded-3xl border border-white/25 bg-slate-900/80 p-3 backdrop-blur-xl shadow-2xl transition-transform hover:scale-105"
            >
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gold block mb-2 px-1">
                Up Next →
              </span>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
                <img
                  src={nextSlide.image}
                  alt={nextSlide.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-110 duration-500"
                />
                <div className="absolute inset-0 bg-black/30" />
              </div>
              <div className="pt-2.5 px-1">
                <h4 className="font-display text-xs font-semibold text-white truncate">
                  {nextSlide.title}
                </h4>
                <p className="text-[10px] text-white/70">{formatPrice(nextSlide.price)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM PROGRESS TABS */}
        <div className="relative z-20 flex items-center justify-between border-t border-white/15 bg-slate-950/60 px-6 py-4 backdrop-blur-md sm:px-12">
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrent(idx)}
                className={`flex items-center gap-2 text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  idx === current ? "text-gold font-bold scale-105" : "text-white/60 hover:text-white"
                }`}
              >
                <span className="font-mono text-[10px]">0{s.id}</span>
                <span>{s.category.split(" ")[0]}</span>
                {idx === current && <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />}
              </button>
            ))}
          </div>

          <div className="hidden sm:block text-[11px] font-mono text-white/50">
            0{current + 1} / 04
          </div>
        </div>
      </div>
    </section>
  );
}
