import { createFileRoute, Link } from "@tanstack/react-router";
import { SareeCard } from "@/components/saree-card";
import { sarees, weaves } from "@/data/sarees";

type ShopSearch = { weave?: string | undefined };

export const Route = createFileRoute("/shop/")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => ({
    weave: typeof search["weave"] === "string" ? search["weave"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Shop Handwoven Sarees | Kadha" },
      {
        name: "description",
        content:
          "Browse the full Kadha collection of handwoven sarees — Kanjivaram, Banarasi, Chanderi, tussar, linen and cotton, with clear prices.",
      },
      { property: "og:title", content: "Shop Handwoven Sarees | Kadha" },
      {
        property: "og:description",
        content: "The full Kadha collection of handwoven sarees, with clear prices.",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Shop Handwoven Sarees | Kadha",
          url: "https://thread-so-fine.lovable.app/shop",
          description:
            "The full Kadha collection of handwoven sarees — Kanjivaram, Chettinad, ikat and cotton.",
          mainEntity: {
            "@type": "ItemList",
            itemListElement: sarees.map((s, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `https://thread-so-fine.lovable.app/shop/${s.slug}`,
              name: s.name,
            })),
          },
        }),
      },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { weave } = Route.useSearch();
  const list = weave ? sarees.filter((s) => s.weave === weave) : sarees;

  const pill =
    "rounded-full px-5 py-2 text-[10px] uppercase tracking-[0.2em] transition-colors border";

  return (
    <div className="pb-8">
      <div className="bg-brand-soft py-16 text-primary-foreground">
        <div className="mx-auto max-w-[1400px] px-5 lg:px-8 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold">The collection</p>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl">Sarees on the loom now</h1>
          <div className="ornament-rule mx-auto mt-5 w-40" />
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-primary-foreground/75">
            A small selection, refreshed as looms finish. Every piece is one of a kind.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-5 lg:px-8">
        <h2 className="mt-12 text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Browse by weave
        </h2>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            to="/shop"
            className={`${pill} ${
              weave
                ? "border-border text-muted-foreground hover:border-gold hover:text-brand"
                : "border-brand bg-brand text-primary-foreground"
            }`}
          >
            All
          </Link>
          {weaves.map((w) => (
            <Link
              key={w}
              to="/shop"
              search={{ weave: w }}
              className={`${pill} ${
                w === weave
                  ? "border-brand bg-brand text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-gold hover:text-brand"
              }`}
            >
              {w}
            </Link>
          ))}
        </div>

        <h2 className="mt-14 text-center font-display text-2xl text-brand-soft">
          {weave ? `${weave} sarees` : "Every saree in the collection"}
        </h2>
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((saree) => (
          <SareeCard key={saree.slug} saree={saree} />
        ))}
        </div>

      {list.length === 0 && (
        <p className="mt-12 text-sm text-muted-foreground">
          Nothing on the loom in this weave right now.
        </p>
      )}
      </div>
    </div>
  );
}