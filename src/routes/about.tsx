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
    <div className="mx-auto max-w-4xl px-6 py-16 sm:py-24 text-foreground font-sans">
      {/* Top Header Badge */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-2 rounded-full bg-gold/15 border border-gold/30 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-gold gold-frame">
          <Sparkles className="h-3.5 w-3.5" /> About Kadha Studio
        </span>
        <h1 className="mt-6 font-display text-4xl sm:text-5xl text-brand-soft leading-tight font-semibold">
          Kadha means story. <br className="hidden sm:inline" />
          Ours is told in thread.
        </h1>
        <div className="mt-4 mx-auto h-0.5 w-16 bg-gold/60" />
      </div>

      {/* Hero Narrative */}
      <div className="mt-12 space-y-6 text-base sm:text-lg leading-relaxed text-muted-foreground text-center sm:text-left">
        <p>
          Kadha was born out of a shared passion and an unbreakable bond between two close friends. We always believed that the beauty of Indian tradition lies in its authenticity. Growing up, we watched the women around us drape stories of grace, strength, and joy through their sarees.
        </p>
        <p className="font-medium text-brand-soft text-lg sm:text-xl italic text-center sm:text-left">
          "We wanted to create something meaningful together—a place where tradition meets uncompromised quality. That shared dream became Kadha."
        </p>
      </div>

      {/* Featured Banner Image */}
      <div className="mt-12 overflow-hidden rounded-3xl border border-gold/30 shadow-xl">
        <img
          src="/logo/About us.png"
          alt="Kadha Studio About Us"
          width={1408}
          height={912}
          loading="lazy"
          className="w-full h-auto max-h-[500px] object-cover"
        />
      </div>

      {/* Our Promise Section */}
      <div className="mt-20 rounded-3xl bg-cream/70 p-8 sm:p-12 border border-gold/30 shadow-xs">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-bold block">Uncompromised Quality</span>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl font-semibold text-brand-soft">
            Our Promise: Curated with Love, Checked with Care
          </h2>
          <p className="mt-3 text-sm text-brand-soft/80 font-medium italic">
            "We don’t just sell sarees; we handpick them as if we were choosing them for our own family."
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="rounded-2xl bg-white p-6 border border-gold/20 shadow-xs space-y-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/15 text-gold">
              <Award className="h-5 w-5" />
            </div>
            <h3 className="font-display text-base font-semibold text-brand-soft">The Best Weavers & Craftsmen</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              We partner closely with skilled and verified manufacturers who have perfected the art of weaving over generations.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 border border-gold/20 shadow-xs space-y-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/15 text-gold">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-display text-base font-semibold text-brand-soft">Rigorous Quality Checks</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Every single saree goes through our personal hands. We touch the fabric, check the borders, inspect the weave, and ensure that only the most flawless pieces make it to your wardrobe.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 border border-gold/20 shadow-xs space-y-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/15 text-gold">
              <Heart className="h-5 w-5" />
            </div>
            <h3 className="font-display text-base font-semibold text-brand-soft">Timeless Elegance</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              From festive celebrations to quiet moments of elegance, our collection is curated to make you feel beautiful, confident, and rooted.
            </p>
          </div>
        </div>
      </div>

      {/* Final Callout: You Are Part of Our Kadha */}
      <div className="mt-20 text-center max-w-2xl mx-auto space-y-6">
        <h2 className="font-display text-3xl sm:text-4xl text-brand-soft font-semibold">
          You are Part of Our Kadha
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
          When you wear a Kadha saree, you aren't just wearing an outfit—you are carrying forward centuries of craftsmanship and becoming a part of our dream.
        </p>
        <p className="text-sm sm:text-base font-medium text-gold italic">
          Thank you for letting us be a small part of your special memories and everyday celebrations.
        </p>

        <div className="pt-6">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-foreground transition-all hover:bg-brand-soft shadow-md hover:scale-105"
          >
            Explore Our Collection
          </Link>
        </div>
      </div>
    </div>
  );
}