import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import heroBanner from "@/assets/hero-banner.jpg";

type Slide = {
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  italic: string;
  copy: string;
  align: "left" | "right";
};

const slides: Slide[] = [
  {
    image: hero1,
    alt: "Three women in emerald, turmeric and wine handwoven silk sarees at a heritage courtyard",
    eyebrow: "Festive edit · 2026",
    title: "Timeless weaves,",
    italic: "living tradition",
    copy: "Kanjivaram silks, Chettinad cottons and ikat handlooms — woven on six family looms and booked in two minutes.",
    align: "left",
  },
  {
    image: hero2,
    alt: "Two women wearing coffee and kumkum checked Chettinad cotton sarees in a sunlit courtyard",
    eyebrow: "Chettinad cottons",
    title: "Everyday drape,",
    italic: "quiet luxury",
    copy: "Breathable checks with real zari borders. Light enough for long days, refined enough for every occasion.",
    align: "right",
  },
  {
    image: hero3,
    alt: "Woman in an ivory ikat handloom saree walking past wooden looms",
    eyebrow: "Loom to door in 14 days",
    title: "Made slowly,",
    italic: "worn for a lifetime",
    copy: "Every piece names its weaver. Small batches, fair pay, and one-of-a-kind pieces you will not see twice.",
    align: "left",
  },
  {
    image: heroBanner,
    alt: "Emerald and gold silk saree draped on a cream backdrop with marigold petals",
    eyebrow: "The Kadha house",
    title: "Handwoven sarees,",
    italic: "the story begins here",
    copy: "A small, considered collection — pit-loom silks and handloom cottons, delivered insured across India.",
    align: "left",
  },
];

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const go = useCallback((n: number) => setIndex((i) => (i + n + slides.length) % slides.length), []);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [index]);

  return (
    <section className="mx-auto max-w-[1400px] px-5 pt-6 lg:px-8">
      <div className="relative min-h-[460px] overflow-hidden rounded-[2rem] sm:min-h-[560px] lg:min-h-[640px]">
        {slides.map((s, i) => {
          const Heading = i === index ? "h1" : ("h2" as const);
          return (
          <div
            key={s.image}
            className={`absolute inset-0 transition-opacity duration-[900ms] ease-out ${
              i === index ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={i !== index}
          >
            <img
              src={s.image}
              alt={s.alt}
              width={1920}
              height={848}
              loading={i === 0 ? "eager" : "lazy"}
              className={`absolute inset-0 h-full w-full object-cover ${
                i === index ? "scale-105" : "scale-100"
              } transition-transform duration-[7000ms] ease-out`}
            />
            <div className="absolute inset-0 bg-black/45" />
            <div
              className={`absolute inset-0 ${
                s.align === "left"
                  ? "bg-gradient-to-r from-black/80 via-black/45 to-black/10"
                  : "bg-gradient-to-l from-black/80 via-black/45 to-black/10"
              }`}
            />
            <div
              className={`relative flex h-full min-h-[460px] flex-col justify-center px-8 py-16 sm:min-h-[560px] lg:min-h-[640px] lg:px-16 ${
                s.align === "right" ? "items-end text-right" : "items-start"
              }`}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-medium text-white backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                {s.eyebrow}
              </span>
              <Heading className="mt-6 max-w-xl font-display text-[2.5rem] font-semibold leading-[0.98] tracking-[-0.03em] text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.45)] sm:text-6xl lg:text-[4.25rem]">
                {s.title}
                <br />
                <span className="font-serif font-normal italic text-gold">{s.italic}</span>
              </Heading>
              <p className="mt-6 max-w-md text-base leading-relaxed text-white/80">
                {s.copy}
              </p>
              <div
                className={`mt-8 flex flex-wrap items-center gap-3 ${
                  s.align === "right" ? "justify-end" : ""
                }`}
              >
                <Link
                  to="/shop"
                  className="rounded-full bg-white px-8 py-4 text-sm font-medium text-ink transition-transform hover:scale-[1.02]"
                >
                  Shop the collection
                </Link>
                <Link
                  to="/booking"
                  className="rounded-full border border-white/40 bg-white/10 px-8 py-4 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/20"
                >
                  Book a fitting
                </Link>
              </div>
            </div>
          </div>
          );
        })}

        {/* Controls */}
        <div className="absolute inset-x-0 bottom-6 z-10 flex items-center justify-center gap-3">
          {slides.map((s, i) => (
            <button
              key={s.image}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to banner ${i + 1}`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-10 bg-white" : "w-4 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous banner"
          className="absolute left-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/25 lg:flex"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next banner"
          className="absolute right-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/25 lg:flex"
        >
          ›
        </button>
      </div>
    </section>
  );
}
