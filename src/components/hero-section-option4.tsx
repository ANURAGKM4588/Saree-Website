import { useState } from "react";
import { Link } from "@tanstack/react-router";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import heroBanner from "@/assets/hero-banner.jpg";
import weaver from "@/assets/weaver.jpg";
import { formatPrice } from "@/data/sarees";
import { ArrowRight, Sparkles, ShieldCheck, Heart, Eye, CheckCircle2 } from "lucide-react";

type ColorVariant = {
  name: string;
  colorHex: string;
  image: string;
  title: string;
  price: number;
  slug: string;
  tag: string;
};

const variants: ColorVariant[] = [
  {
    name: "Emerald Green",
    colorHex: "#047857",
    image: hero1,
    title: "Yellow Teal Mulmul Cotton Saree",
    price: 3099,
    slug: "yellow-teal-mulmul-cotton-saree",
    tag: "Kanjivaram Festive Silk",
  },
  {
    name: "Turmeric Yellow",
    colorHex: "#d97706",
    image: hero2,
    title: "Mustard Yellow Sungudi Cotton Saree",
    price: 3299,
    slug: "mustard-yellow-sungudi-cotton-saree",
    tag: "Chettinad Handloom",
  },
  {
    name: "Kumkum Red",
    colorHex: "#b91c1c",
    image: heroBanner,
    title: "Red Sungudi Saree",
    price: 3399,
    slug: "red-sungudi-saree",
    tag: "Traditional Bridal Silk",
  },
  {
    name: "Ivory Ikat",
    colorHex: "#f5f5f4",
    image: hero3,
    title: "White Ikat Mulmul Saree",
    price: 2999,
    slug: "white-ikat-mulmul-saree",
    tag: "Handloom Mulmul Ikat",
  },
];

export function HeroSectionOption4() {
  const [selectedVariant, setSelectedVariant] = useState(0);
  const active = variants[selectedVariant];

  return (
    <section className="mx-auto max-w-[1400px] px-4 pt-4 lg:px-8">
      {/* HEADER EDITORIAL BANNER */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-gold animate-ping" />
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-gold">
              The Kerala Handloom House · 2026 Collection
            </span>
          </div>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] text-brand-soft">
            Artisanal Sarees. <span className="font-serif italic font-normal text-gold">Direct from Looms.</span>
          </h1>
        </div>

        <p className="max-w-md text-xs sm:text-sm text-muted-foreground leading-relaxed">
          A considered collection of pitloom silks & breathable handloom cottons. Every saree comes with a complimentary attached blouse piece & free insured Kerala shipping.
        </p>
      </div>

      {/* BENTO GRID MAGAZINE HERO LAYOUT */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* CARD 1 (MAIN FEATURED SHOWCASE - 7 COLS) */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-gold/30 bg-card p-6 sm:p-8 lg:col-span-7 flex flex-col justify-between shadow-[0_20px_50px_-15px_rgba(4,120,87,0.15)] group">
          {/* Dynamic Image Container */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-3xl bg-secondary">
            <img
              src={active.image}
              alt={active.title}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

            {/* Top Floating Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-brand px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground shadow-md">
                {active.tag}
              </span>
              <span className="rounded-full bg-cream/90 border border-gold/40 px-3 py-1 text-[10px] font-semibold text-brand-soft backdrop-blur-md">
                ✂️ With Attached Blouse
              </span>
            </div>

            {/* Price Badge Overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold">Featured Drape</p>
                <h3 className="font-display text-lg sm:text-xl font-semibold">{active.title}</h3>
              </div>
              <span className="font-display text-2xl font-extrabold text-gold tabular-nums">
                {formatPrice(active.price)}
              </span>
            </div>
          </div>

          {/* INTERACTIVE COLOR SWATCH PALETTE */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border/80 pt-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground block mb-2">
                Select Shade Swatch to Preview:
              </span>
              <div className="flex items-center gap-3">
                {variants.map((v, idx) => (
                  <button
                    key={v.name}
                    type="button"
                    onClick={() => setSelectedVariant(idx)}
                    className={`group relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all cursor-pointer ${
                      idx === selectedVariant
                        ? "border-gold scale-110 shadow-md"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: v.colorHex }}
                    title={v.name}
                  >
                    {idx === selectedVariant && (
                      <CheckCircle2
                        className={`h-5 w-5 ${
                          v.name === "Ivory Ikat" ? "text-slate-900" : "text-white"
                        }`}
                      />
                    )}
                  </button>
                ))}
                <span className="text-xs font-semibold text-brand-soft ml-1">{active.name}</span>
              </div>
            </div>

            <Link
              to="/shop/$slug"
              params={{ slug: active.slug }}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-7 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground hover:bg-brand-soft transition-all shadow-md cursor-pointer"
            >
              <span>View & Order Saree</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN (2 STACKED CARDS - 5 COLS) */}
        <div className="space-y-6 lg:col-span-5 flex flex-col justify-between">
          {/* CARD 2: WEAVER ARTISAN FEATURE */}
          <div className="rounded-[2.5rem] border border-border bg-cream/50 p-6 space-y-4 shadow-2xs">
            <div className="flex items-center gap-4">
              <img
                src={weaver}
                alt="Kerala Handloom Pitloom Weaver"
                className="h-16 w-16 rounded-2xl object-cover border border-gold/40 shadow-xs"
              />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">Artisan Story</span>
                <h3 className="font-display text-base font-bold text-brand-soft">Master Weaver Ramanathan</h3>
                <p className="text-[11px] text-muted-foreground">Kanchipuram & Kerala Pitlooms</p>
              </div>
            </div>

            <blockquote className="text-xs italic text-muted-foreground leading-relaxed border-l-2 border-gold pl-3">
              "Every saree takes 14 days of dedicated hand weaving. We preserve 80-year-old weaving patterns passed down through generations."
            </blockquote>
          </div>

          {/* CARD 3: WEAVE CATEGORIES QUICK GRID */}
          <div className="rounded-[2.5rem] border border-border bg-card p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
                Browse by Handloom Weave
              </span>
              <Sparkles className="h-4 w-4 text-gold" />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { name: "Kanjivaram Silk", count: "12 Styles", icon: "👑" },
                { name: "Chettinad Cotton", count: "8 Styles", icon: "🌸" },
                { name: "Mulmul Ikat", count: "6 Styles", icon: "🧵" },
                { name: "Pitloom Linen", count: "10 Styles", icon: "✨" },
              ].map((w) => (
                <Link
                  key={w.name}
                  to="/shop"
                  className="flex items-center gap-2.5 rounded-2xl border border-border bg-secondary/50 p-3 hover:border-gold hover:bg-cream transition-all group cursor-pointer"
                >
                  <span className="text-lg">{w.icon}</span>
                  <div>
                    <h4 className="font-display text-xs font-semibold text-foreground group-hover:text-brand-soft">
                      {w.name}
                    </h4>
                    <span className="text-[10px] text-muted-foreground">{w.count}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
