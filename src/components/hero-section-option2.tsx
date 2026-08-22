import { useState, useEffect, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import heroBanner from "@/assets/hero-banner.jpg";
import { formatPrice } from "@/data/sarees";
import { ArrowRight, Sparkles, ChevronRight, ShieldCheck, Heart } from "lucide-react";

type HeroItem = {
  id: string;
  tag: string;
  titleLine1: string;
  titleItalic: string;
  titleLine2: string;
  description: string;
  image: string;
  sareeName: string;
  price: number;
  slug: string;
  weaveType: string;
};

const heroItems: HeroItem[] = [
  {
    id: "01",
    tag: "Kanjivaram Festive Silk",
    titleLine1: "Woven in silence,",
    titleItalic: "worn in splendor",
    titleLine2: "for generations.",
    description:
      "Handcrafted on heritage pit-looms using pure zari threads and mulberry silk. A royal saree that tells a story with every drape.",
    image: hero1,
    sareeName: "Emerald Pure Kanjivaram Silk",
    price: 3499,
    slug: "yellow-teal-mulmul-cotton-saree",
    weaveType: "Pitloom Silk",
  },
  {
    id: "02",
    tag: "Chettinad Cotton Collection",
    titleLine1: "Everyday luxury,",
    titleItalic: "quiet elegance",
    titleLine2: "all day long.",
    description:
      "Breathable handspun cotton checks with gold borders. Designed for effortless grace in warm tropical climates.",
    image: hero2,
    sareeName: "Coffee & Kumkum Chettinad Cotton",
    price: 3299,
    slug: "mustard-yellow-sungudi-cotton-saree",
    weaveType: "Handspun Cotton",
  },
  {
    id: "03",
    tag: "Handloom Mulmul Ikat",
    titleLine1: "Slowly crafted,",
    titleItalic: "timeless beauty",
    titleLine2: "loom to door.",
    description:
      "Precision resist-dyed yarns woven into featherlight ikat patterns. Direct support to 6 traditional artisan weaver families.",
    image: hero3,
    sareeName: "Ivory Ikat Mulmul Saree",
    price: 2999,
    slug: "white-ikat-mulmul-saree",
    weaveType: "Ikat Handloom",
  },
  {
    id: "04",
    tag: "Kadha Signature Weaves",
    titleLine1: "Unmatched heritage,",
    titleItalic: "authentic craft",
    titleLine2: "delivered insured.",
    description:
      "Curated limited-edition sarees with complimentary attached blouse pieces. Free insured shipping across Kerala and India.",
    image: heroBanner,
    sareeName: "Turmeric Gold Bridal Silk",
    price: 3799,
    slug: "orange-sungudi-cotton-saree",
    weaveType: "Heritage Weave",
  },
];

export function HeroSectionOption2() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % heroItems.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6500);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const current = heroItems[activeIndex];

  return (
    <section className="mx-auto max-w-[1400px] px-4 pt-4 lg:px-8">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-gold/30 bg-gradient-to-br from-cream/90 via-amber-50/40 to-background p-6 sm:p-10 lg:p-14 shadow-[0_20px_60px_-15px_rgba(4,120,87,0.12)]">
        {/* Background Subtle Luxury Watermark */}
        <div className="pointer-events-none absolute -right-20 -top-20 text-[18rem] font-serif font-black opacity-[0.03] select-none text-brand">
          KADHA
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          {/* LEFT COLUMN: Editorial Text & Collection Navigation */}
          <div className="space-y-6 lg:col-span-7">
            {/* House Emblem Pill */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand-soft">
                Kadha Handwoven Studio · Kerala
              </span>
            </div>

            {/* Main Display Headline with Animated Key */}
            <div className="min-h-[160px] sm:min-h-[200px] transition-all duration-500">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold block mb-2">
                {current.tag}
              </span>
              <h1 className="font-display text-3xl font-semibold leading-[1.08] tracking-[-0.02em] text-brand-soft sm:text-5xl lg:text-6xl">
                {current.titleLine1}{" "}
                <span className="font-serif italic font-normal text-gold underline decoration-gold/30 underline-offset-8">
                  {current.titleItalic}
                </span>{" "}
                {current.titleLine2}
              </h1>
            </div>

            {/* Description */}
            <p className="max-w-xl text-xs sm:text-sm leading-relaxed text-muted-foreground">
              {current.description}
            </p>

            {/* Interactive Collection Selector Tabs */}
            <div className="pt-2">
              <div className="flex flex-wrap items-center gap-2 border-t border-border/80 pt-4">
                {heroItems.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-bold transition-all cursor-pointer ${
                      idx === activeIndex
                        ? "bg-brand text-primary-foreground shadow-md scale-105"
                        : "bg-card border border-border/80 text-muted-foreground hover:border-gold hover:text-foreground"
                    }`}
                  >
                    <span className="font-mono text-[10px] opacity-70">{item.id}</span>
                    <span>{item.tag.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons & Features */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-brand px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground shadow-lg hover:bg-brand-soft hover:shadow-xl transition-all group cursor-pointer"
              >
                <span>Shop Collection</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/booking"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-gold/50 bg-cream/60 px-7 py-4 text-xs font-bold uppercase tracking-[0.18em] text-brand-soft hover:bg-gold hover:text-brand-soft transition-all shadow-2xs cursor-pointer"
              >
                <Sparkles className="h-4 w-4 text-gold" />
                <span>Reserve Custom Saree</span>
              </Link>
            </div>

            {/* Quick Guarantees */}
            <div className="flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground pt-2">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <ShieldCheck className="h-4 w-4 text-emerald-700" /> Insured Delivery
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1.5 font-medium">
                ✂️ Attached Blouse Piece Included
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: 3D Curved Showcase Card & Interactive Preview */}
          <div className="relative lg:col-span-5">
            <div className="relative mx-auto aspect-[3/4] w-full max-w-[420px] overflow-hidden rounded-[2.5rem] border border-gold/40 bg-card shadow-[0_30px_90px_-20px_rgba(4,120,87,0.35)] transition-all duration-700">
              {/* Dynamic Ken Burns Images */}
              {heroItems.map((item, idx) => (
                <div
                  key={item.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
                    idx === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.sareeName}
                    className={`h-full w-full object-cover transition-transform duration-[8000ms] ease-out ${
                      idx === activeIndex ? "scale-110" : "scale-100"
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                </div>
              ))}

              {/* Floating Product Details Chip at Bottom of Frame */}
              <div className="absolute bottom-5 left-5 right-5 z-20 rounded-2xl border border-white/20 bg-slate-950/80 p-4 text-white backdrop-blur-xl shadow-lg">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gold block">
                      {current.weaveType}
                    </span>
                    <h3 className="font-display text-sm font-semibold text-white truncate">
                      {current.sareeName}
                    </h3>
                  </div>

                  <Link
                    to="/shop/$slug"
                    params={{ slug: current.slug }}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold text-brand-soft hover:bg-gold-soft transition-all shadow-md cursor-pointer"
                    title="View Saree Details"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>

              {/* Top-Right Indicator Pill */}
              <div className="absolute top-5 right-5 z-20 rounded-full border border-white/30 bg-black/40 px-3.5 py-1.5 text-[10px] font-mono font-bold text-white backdrop-blur-md">
                {current.id} / 04
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
