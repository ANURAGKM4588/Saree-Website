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
    <div className="mx-auto max-w-4xl px-6 py-16 sm:py-24 font-sans text-slate-800 space-y-20">
      {/* 1. MINIMAL HERO HEADER */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold block">
          About Kadha Studio
        </span>
        <h1 className="font-display text-4xl sm:text-5xl text-slate-900 leading-tight font-semibold">
          Kadha means story. <br />
          <span className="text-gold italic font-normal">Ours is told in thread.</span>
        </h1>
        <div className="mx-auto h-0.5 w-12 bg-gold/60" />
      </div>

      {/* 2. MINIMAL NARRATIVE & FEATURED IMAGE */}
      <div className="space-y-10">
        <div className="space-y-5 text-base sm:text-lg leading-relaxed text-slate-600">
          <p>
            Kadha was born out of a shared passion and an unbreakable bond between two close friends. We always believed that the beauty of Indian tradition lies in its authenticity. Growing up, we watched the women around us drape stories of grace, strength, and joy through their sarees.
          </p>
          <p className="text-slate-900 font-medium italic text-lg sm:text-xl border-l-2 border-gold pl-5 py-2 bg-amber-50/50 rounded-r-lg">
            We wanted to create something meaningful together—a place where tradition meets uncompromised quality. That shared dream became Kadha.
          </p>
        </div>

        {/* Clean Featured Image */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/90 shadow-sm">
          <img
            src="/logo/About us.png"
            alt="Kadha Studio About Us"
            width={1408}
            height={912}
            loading="lazy"
            className="w-full h-auto max-h-[500px] object-cover"
          />
        </div>
      </div>

      {/* 3. MINIMAL 3-COLUMN PILLARS */}
      <div className="space-y-8 pt-4">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold block">
            Quality & Craftsmanship
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900">
            Curated with Love, Checked with Care
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 italic">
            "We don’t just sell sarees; we handpick them as if we were choosing them for our own family."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-6 space-y-3 hover:border-gold/50 transition-colors">
            <div className="h-10 w-10 rounded-lg bg-gold/15 flex items-center justify-center text-gold">
              <Award className="h-5 w-5" />
            </div>
            <h3 className="font-display text-base font-semibold text-slate-900">
              The Best Weavers & Craftsmen
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We partner closely with skilled and verified manufacturers who have perfected the art of weaving over generations.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-6 space-y-3 hover:border-gold/50 transition-colors">
            <div className="h-10 w-10 rounded-lg bg-gold/15 flex items-center justify-center text-gold">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-display text-base font-semibold text-slate-900">
              Rigorous Quality Checks
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every single saree goes through our personal hands. We touch the fabric, check the borders, inspect the weave, and ensure that only the most flawless pieces make it to your wardrobe.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-6 space-y-3 hover:border-gold/50 transition-colors">
            <div className="h-10 w-10 rounded-lg bg-gold/15 flex items-center justify-center text-gold">
              <Heart className="h-5 w-5" />
            </div>
            <h3 className="font-display text-base font-semibold text-slate-900">
              Timeless Elegance
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              From festive celebrations to quiet moments of elegance, our collection is curated to make you feel beautiful, confident, and rooted.
            </p>
          </div>
        </div>
      </div>

      {/* 4. MINIMAL CLOSING CALLOUT */}
      <div className="rounded-2xl border border-slate-200/90 bg-slate-50/80 p-8 sm:p-12 text-center space-y-5">
        <h2 className="font-display text-2xl sm:text-4xl font-semibold text-slate-900">
          You are Part of Our Kadha
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">
          When you wear a Kadha saree, you aren't just wearing an outfit—you are carrying forward centuries of craftsmanship and becoming a part of our dream.
        </p>
        <p className="text-xs sm:text-sm font-medium text-gold italic">
          Thank you for letting us be a small part of your special memories and everyday celebrations.
        </p>
        <div className="pt-2">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-all hover:bg-gold hover:text-slate-900 shadow-sm"
          >
            Explore Our Collection
          </Link>
        </div>
      </div>
    </div>
  );
}