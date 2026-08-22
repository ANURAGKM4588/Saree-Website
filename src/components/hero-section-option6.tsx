import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSectionOption6() {
  return (
    <section className="relative w-full overflow-hidden bg-slate-950">
      {/* FULL BLEED EDGE-TO-EDGE FILLED HERO CONTAINER */}
      <div className="relative w-full min-h-[560px] sm:min-h-[640px] lg:min-h-[720px] group">
        
        {/* HERO BACKGROUND IMAGE FROM public/herosection/Herosection.png */}
        <img
          src="/herosection/Herosection.png"
          alt="Kadha Handwoven Sarees Collection"
          width={1920}
          height={1080}
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[10000ms] ease-out group-hover:scale-105"
        />

        {/* ELEGANT MINIMAL GRADIENT OVERLAY FOR PERFECT READABILITY */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/50 to-slate-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30" />

        {/* ALL-WHITE ELEGANT & MINIMAL TEXT OVERLAY ON IMAGE */}
        <div className="relative z-10 mx-auto max-w-[1400px] flex h-full min-h-[560px] sm:min-h-[640px] lg:min-h-[720px] flex-col justify-between p-6 sm:p-12 lg:p-16">
          
          {/* TOP EYEBROW BADGE (FONT-SANS SUBHEADING) */}
          <div className="flex items-center justify-between pt-2 sm:pt-4">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/30 bg-white/10 px-4.5 py-2 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-white">
                Kadha Handwoven Studio · Kerala 2026
              </span>
            </div>

            <div className="hidden sm:inline-flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
              <Sparkles className="h-3.5 w-3.5 text-white" /> Insured Free Kerala Delivery
            </div>
          </div>

          {/* MAIN HERO HEADLINE & COPY (ALL WHITE CORMORANT GARAMOND SERIF TYPOGRAPHY) */}
          <div className="my-auto max-w-3xl space-y-6 pt-10 pb-6">
            <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl drop-shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
              Timeless Weaves,
              <br />
              Living Tradition.
            </h1>

            <p className="max-w-xl text-sm sm:text-base font-light leading-relaxed text-white/90 drop-shadow-xs">
              Kanjivaram silks, Chettinad cottons & ikat handlooms — woven on traditional pit-looms and booked in two minutes. Complimentary attached blouse included with every saree.
            </p>

            {/* MINIMAL WHITE BUTTONS */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-white px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-950 shadow-lg hover:bg-white/90 transition-all cursor-pointer group"
              >
                <span>Shop Collection</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/booking"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md hover:bg-white/25 transition-all cursor-pointer"
              >
                Reserve Saree
              </Link>
            </div>
          </div>

          {/* BOTTOM MINIMAL FOOTER STRIP ON IMAGE */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/20 pt-6 pb-2 text-xs text-white/80 font-light">
            <div className="flex items-center gap-6">
              <span>🌿 100% Pitloom Handwoven</span>
              <span>•</span>
              <span>✂️ Attached Blouse Included</span>
            </div>

            <div className="text-[11px] font-mono text-white/70">
              LIMITED BATCH · 2026 EDITION
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
