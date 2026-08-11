import { createFileRoute, Link } from "@tanstack/react-router";
import weaver from "@/assets/weaver.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "The House of Kadha | Handloom Sarees" },
      {
        name: "description",
        content:
          "Kadha works with six family looms to make a handful of sarees each month — named weavers, honest prices, no factory floor.",
      },
      { property: "og:title", content: "The House of Kadha" },
      {
        property: "og:description",
        content: "Six family looms, a handful of sarees each month, named weavers.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <p className="text-[11px] uppercase tracking-[0.3em] text-brand">The story begins here</p>
      <h1 className="mt-5 font-display text-5xl leading-[1.05]">
        Kadha means story. Ours is told in thread.
      </h1>
      <h2 className="mt-12 font-display text-2xl text-brand-soft">How Kadha began</h2>
      <p className="mt-6 text-sm leading-loose text-muted-foreground">
        We began with one loom in a courtyard and a simple idea: a saree should be able to name the
        hands that made it. Today six families weave for Kadha, each on their own pit loom, each
        finishing only a few pieces a month. Nothing is duplicated, nothing is rushed.
      </p>
      <img
        src={weaver}
        alt="A weaver passing green silk thread through a wooden handloom"
        width={1408}
        height={912}
        loading="lazy"
        className="mt-14 aspect-[16/10] w-full object-cover"
      />
      <h2 className="mt-14 font-display text-2xl text-brand-soft">How we price and pay</h2>
      <p className="mt-6 text-sm leading-loose text-muted-foreground">
        We buy yarn direct, pay the weaver before a saree sells, and keep our prices plain — no
        seasonal theatre, no invented discounts. What you pay reflects the days on the loom and the
        quality of the silk, and nothing else.
      </p>
      <img
        src="/Product/amber-peacock-silk-cotton.png"
        alt="Amber silk cotton saree with a wine and gold peacock border folded in a brass plate"
        width={1148}
        height={1568}
        loading="lazy"
        className="mt-14 aspect-[16/10] w-full rounded-[2rem] object-cover"
      />
      <Link
        to="/shop"
        className="mt-14 inline-block border border-brand px-8 py-3 text-[11px] uppercase tracking-[0.22em] text-brand transition-colors hover:bg-brand hover:text-primary-foreground"
      >
        See the collection
      </Link>
    </div>
  );
}