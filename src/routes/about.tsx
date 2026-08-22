import { createFileRoute, Link } from "@tanstack/react-router";
import weaver from "@/assets/weaver.jpg";
import { Heart, ShieldCheck, Sparkles, Award } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Story & Journey | Kadha Studio" },
      {
        name: "description",
        content:
          "Kadha was born out of a shared passion between two close friends. Handpicked sarees, verified weavers, and rigorous quality checks.",
      },
      { property: "og:title", content: "Our Journey & Story | Kadha Studio" },
      {
        property: "og:description",
        content: "Curated with Love, Checked with Care. Discover the story behind Kadha sarees.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground pb-24">
      {/* 1. EDITORIAL CENTERED HERO */}
      <div className="relative py-16 sm:py-24 px-6 sm:px-12 text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-gold/10 border border-gold/30 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-gold gold-frame">
          <Sparkles className="h-3.5 w-3.5" /> About Kadha Studio
        </div>

        <h1 className="font-display text-4xl sm:text-6xl text-brand-soft leading-[1.1] font-semibold">
          Kadha means story. <br />
          <span className="text-gold italic font-normal">Ours is told in thread.</span>
        </h1>

        <div className="mx-auto h-0.5 w-24 bg-gold/60 my-4" />

        <p className="text-base sm:text-lg sm:leading-relaxed text-muted-foreground font-normal max-w-3xl mx-auto">
          Kadha was born out of a shared passion and an unbreakable bond between two close friends. We always believed that the beauty of Indian tradition lies in its authenticity. Growing up, we watched the women around us drape stories of grace, strength, and joy through their sarees.
        </p>

        <p className="text-base sm:text-lg sm:leading-relaxed text-brand-soft font-medium italic max-w-3xl mx-auto pt-2">
          We wanted to create something meaningful together—a place where tradition meets uncompromised quality. That shared dream became Kadha.
        </p>
      </div>

      {/* 2. ASYMMETRIC IMAGE & EDITORIAL PROMISE LIST */}
      <div className="mx-auto max-w-[1280px] px-6 sm:px-12 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Featured Image with Floating Gold Badge */}
          <div className="lg:col-span-6 relative">
            <div className="sticky top-28">
              <div className="relative rounded-3xl overflow-hidden border-2 border-gold/40 shadow-2xl bg-white">
                <img
                  src="/logo/About us.png"
                  alt="Kadha Studio About Us"
                  width={1408}
                  height={912}
                  loading="lazy"
                  className="w-full h-auto max-h-[600px] object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/90 backdrop-blur-md p-4 border border-gold/30 shadow-lg text-center">
                  <span className="text-[11px] uppercase tracking-[0.22em] text-brand-soft font-bold block">
                    Handpicked Heritage • Verified Weavers
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Our Promise Editorial Timeline */}
          <div className="lg:col-span-6 space-y-8">
            <div className="border-b border-gold/30 pb-6">
              <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-bold block">
                Uncompromised Quality Standard
              </span>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-semibold text-brand-soft">
                Our Promise: Curated with Love, Checked with Care
              </h2>
              <p className="mt-3 text-sm text-muted-foreground font-medium italic">
                "We don’t just sell sarees; we handpick them as if we were choosing them for our own family."
              </p>
            </div>

            {/* Editorial Step 01 */}
            <div className="flex items-start gap-5 group p-6 rounded-2xl bg-cream/40 border border-gold/20 hover:border-gold hover:bg-white transition-all duration-300 shadow-2xs">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold text-brand-soft font-display font-bold text-lg">
                01
              </div>
              <div className="space-y-1">
                <h3 className="font-display text-xl font-semibold text-brand-soft flex items-center gap-2">
                  <Award className="h-5 w-5 text-gold" /> The Best Weavers & Craftsmen
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  We partner closely with skilled and verified manufacturers who have perfected the art of weaving over generations.
                </p>
              </div>
            </div>

            {/* Editorial Step 02 */}
            <div className="flex items-start gap-5 group p-6 rounded-2xl bg-cream/40 border border-gold/20 hover:border-gold hover:bg-white transition-all duration-300 shadow-2xs">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold text-brand-soft font-display font-bold text-lg">
                02
              </div>
              <div className="space-y-1">
                <h3 className="font-display text-xl font-semibold text-brand-soft flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-gold" /> Rigorous Quality Checks
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  Every single saree goes through our personal hands. We touch the fabric, check the borders, inspect the weave, and ensure that only the most flawless pieces make it to your wardrobe.
                </p>
              </div>
            </div>

            {/* Editorial Step 03 */}
            <div className="flex items-start gap-5 group p-6 rounded-2xl bg-cream/40 border border-gold/20 hover:border-gold hover:bg-white transition-all duration-300 shadow-2xs">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold text-brand-soft font-display font-bold text-lg">
                03
              </div>
              <div className="space-y-1">
                <h3 className="font-display text-xl font-semibold text-brand-soft flex items-center gap-2">
                  <Heart className="h-5 w-5 text-gold" /> Timeless Elegance
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  From festive celebrations to quiet moments of elegance, our collection is curated to make you feel beautiful, confident, and rooted.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. EDITORIAL FOOTER CALLOUT */}
      <div className="mx-auto max-w-[1280px] px-6 sm:px-12 pt-20">
        <div className="rounded-3xl bg-cream/70 p-10 sm:p-16 text-center border-2 border-gold/40 shadow-xl relative overflow-hidden">
          <div className="relative max-w-3xl mx-auto space-y-6">
            <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-gold font-bold">
              <Sparkles className="h-3.5 w-3.5" /> Welcome To The Family
            </span>

            <h2 className="font-display text-3xl sm:text-5xl font-semibold leading-tight text-brand-soft">
              You are Part of Our Kadha
            </h2>

            <p className="text-sm sm:text-base leading-relaxed text-muted-foreground font-normal">
              When you wear a Kadha saree, you aren't just wearing an outfit—you are carrying forward centuries of craftsmanship and becoming a part of our dream.
            </p>

            <p className="text-base sm:text-lg font-medium text-brand-soft italic">
              Thank you for letting us be a small part of your special memories and everyday celebrations.
            </p>

            <div className="pt-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-9 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-brand-soft transition-all hover:bg-gold-soft hover:scale-105 shadow-md cursor-pointer"
              >
                Explore Our Collection
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}