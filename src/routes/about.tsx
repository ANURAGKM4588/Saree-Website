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
      {/* 1. HERO BANNER & STORY SPLIT SECTION */}
      <div className="relative overflow-hidden bg-brand-soft text-primary-foreground py-20 px-6 sm:px-12 lg:px-16 border-b border-gold/20">
        {/* Decorative subtle background gold glows */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-gold/10 blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-[1300px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Headline & Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-gold/20 border border-gold/40 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-gold gold-frame">
                <Sparkles className="h-3.5 w-3.5" /> About Kadha Studio
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-primary-foreground leading-[1.1] font-semibold">
                Kadha means story. <br className="hidden sm:inline" />
                <span className="text-gold italic font-normal">Ours is told in thread.</span>
              </h1>

              <div className="h-0.5 w-20 bg-gold/50" />

              <p className="text-base sm:text-lg leading-relaxed text-primary-foreground/90 font-light">
                Kadha was born out of a shared passion and an unbreakable bond between two close friends. We always believed that the beauty of Indian tradition lies in its authenticity. Growing up, we watched the women around us drape stories of grace, strength, and joy through their sarees.
              </p>

              {/* Quote Card */}
              <div className="relative rounded-2xl bg-white/10 p-6 border border-gold/30 backdrop-blur-xs shadow-lg">
                <p className="font-display text-lg sm:text-xl text-gold italic leading-relaxed">
                  "We wanted to create something meaningful together—a place where tradition meets uncompromised quality. That shared dream became Kadha."
                </p>
              </div>
            </div>

            {/* Right Column: Featured Image in Luxury Gold Offset Frame */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Gold offset background box */}
                <div className="absolute -inset-3 rounded-3xl bg-gold/20 gold-frame rotate-1 scale-[1.02] pointer-events-none" />
                
                {/* Main Image Frame */}
                <div className="relative overflow-hidden rounded-3xl border-2 border-gold/40 bg-brand shadow-2xl">
                  <img
                    src="/logo/About us.png"
                    alt="Kadha Studio About Us"
                    width={1408}
                    height={912}
                    loading="lazy"
                    className="w-full h-auto max-h-[520px] object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-black/60 backdrop-blur-md p-3 border border-white/10 text-center">
                    <span className="text-[10px] uppercase tracking-[0.22em] text-gold font-bold">
                      Curated with Love • Checked with Care
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. OUR PROMISE & 3 PILLARS SECTION */}
      <div className="mx-auto max-w-[1300px] px-6 sm:px-12 pt-20">
        <div className="rounded-3xl bg-cream/70 p-8 sm:p-14 border border-gold/30 shadow-sm relative overflow-hidden">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-[11px] uppercase tracking-[0.25em] text-gold font-bold block">
              Uncompromised Quality Standard
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-brand-soft">
              Our Promise: Curated with Love, Checked with Care
            </h2>
            <div className="mx-auto h-0.5 w-16 bg-gold/60 my-2" />
            <p className="text-sm sm:text-base text-brand-soft/85 font-medium italic">
              "We don’t just sell sarees; we handpick them as if we were choosing them for our own family."
            </p>
          </div>

          {/* 3 Pillars Grid */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="group rounded-2xl bg-white p-8 border border-gold/25 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-gold">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/15 text-gold group-hover:bg-gold group-hover:text-brand-soft transition-colors">
                <Award className="h-7 w-7" />
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold text-brand-soft">
                The Best Weavers & Craftsmen
              </h3>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                We partner closely with skilled and verified manufacturers who have perfected the art of weaving over generations.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="group rounded-2xl bg-white p-8 border border-gold/25 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-gold">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/15 text-gold group-hover:bg-gold group-hover:text-brand-soft transition-colors">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold text-brand-soft">
                Rigorous Quality Checks
              </h3>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                Every single saree goes through our personal hands. We touch the fabric, check the borders, inspect the weave, and ensure that only the most flawless pieces make it to your wardrobe.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="group rounded-2xl bg-white p-8 border border-gold/25 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-gold">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/15 text-gold group-hover:bg-gold group-hover:text-brand-soft transition-colors">
                <Heart className="h-7 w-7" />
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold text-brand-soft">
                Timeless Elegance
              </h3>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                From festive celebrations to quiet moments of elegance, our collection is curated to make you feel beautiful, confident, and rooted.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SIGNATURE CLOSING BANNER */}
      <div className="mx-auto max-w-[1300px] px-6 sm:px-12 pt-16">
        <div className="relative overflow-hidden rounded-3xl bg-brand-soft p-10 sm:p-16 text-center text-primary-foreground border-2 border-gold/40 shadow-2xl gold-frame">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold/10 blur-2xl pointer-events-none" />

          <div className="relative max-w-3xl mx-auto space-y-6">
            <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-gold font-bold">
              <Sparkles className="h-3.5 w-3.5" /> Welcome To The Family
            </span>

            <h2 className="font-display text-3xl sm:text-5xl font-semibold leading-tight text-primary-foreground">
              You are Part of Our Kadha
            </h2>

            <p className="text-sm sm:text-base leading-relaxed text-primary-foreground/90 font-light">
              When you wear a Kadha saree, you aren't just wearing an outfit—you are carrying forward centuries of craftsmanship and becoming a part of our dream.
            </p>

            <p className="text-base sm:text-lg font-medium text-gold italic">
              Thank you for letting us be a small part of your special memories and everyday celebrations.
            </p>

            <div className="pt-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-9 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-brand-soft transition-all hover:bg-gold-soft hover:scale-105 shadow-xl cursor-pointer"
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