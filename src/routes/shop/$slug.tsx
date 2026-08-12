import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { QuantityStepper } from "@/components/quantity-stepper";
import { SareeCard } from "@/components/saree-card";
import { formatPrice, getSaree, sarees, type SareeView } from "@/data/sarees";
import { useCart } from "@/lib/cart";
import { useShopStore } from "@/lib/shop-store";
import { Bell, Check, Sparkles, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/shop/$slug")({
  loader: ({ params }) => {
    const saree = getSaree(params.slug);
    if (!saree) throw notFound();
    return saree;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — ${loaderData.weave} Saree | Kadha` },
          { name: "description", content: loaderData.blurb },
          { property: "og:title", content: `${loaderData.name} | Kadha` },
          { property: "og:description", content: loaderData.blurb },
        ]
      : [],
    scripts: loaderData
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: loaderData.name,
              description: loaderData.blurb,
              image: loaderData.views.map((v) => v.url),
              material: loaderData.fabric,
              brand: { "@type": "Brand", name: "Kadha" },
              offers: {
                "@type": "Offer",
                price: loaderData.price,
                priceCurrency: "INR",
                availability: "https://schema.org/InStock",
                url: `https://thread-so-fine.lovable.app/shop/${loaderData.slug}`,
              },
            }),
          },
        ]
      : [],
  }),
  component: Product,
});

function Product() {
  const saree = Route.useLoaderData();
  const { add } = useCart();
  const { products, incrementCartAdds, createNotifyRequest } = useShopStore();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);

  // Notify Modal State
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifyPhone, setNotifyPhone] = useState("");
  const [notifySubmitted, setNotifySubmitted] = useState(false);

  const storedProduct = products.find((p) => p.slug === saree.slug);
  const status = storedProduct?.status || "in_stock";

  const gallery: SareeView[] = saree.views;
  const current: SareeView =
    gallery[Math.min(active, gallery.length - 1)] ?? { url: saree.image, label: "Full drape" };

  const related = sarees.filter((s) => s.slug !== saree.slug).slice(0, 3);

  const handleAddToCart = () => {
    add(saree.slug, qty);
    incrementCartAdds(saree.slug, qty);
  };

  const handleBookNow = () => {
    add(saree.slug, qty);
    incrementCartAdds(saree.slug, qty);
    navigate({ to: "/booking" });
  };

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyEmail) return;

    createNotifyRequest({
      sareeSlug: saree.slug,
      sareeName: saree.name,
      customerEmail: notifyEmail,
      customerPhone: notifyPhone || undefined,
      type: status === "coming_soon" ? "coming_soon" : "out_of_stock",
    });

    setNotifySubmitted(true);
    setTimeout(() => {
      setNotifySubmitted(false);
      setShowNotifyModal(false);
      setNotifyEmail("");
      setNotifyPhone("");
    }, 2500);
  };

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-12 lg:px-8">
      <Link
        to="/shop"
        className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-brand"
      >
        ← Collection
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col gap-4 sm:flex-row-reverse sm:items-start">
          <div className="relative flex-1 aspect-[3/4] overflow-hidden rounded-3xl bg-secondary">
            <img
              key={current.url}
              src={current.url}
              alt={`${saree.name} — ${saree.weave} saree, ${current.label.toLowerCase()}`}
              width={912}
              height={1200}
              className="h-full w-full object-cover"
            />
            {status === "in_stock" && (
              <span className="absolute left-5 top-5 rounded-full bg-background/90 px-4 py-1.5 text-[10px] uppercase tracking-[0.22em] text-brand-soft gold-frame">
                One of a kind
              </span>
            )}
            {status === "out_of_stock" && (
              <span className="absolute left-5 top-5 rounded-full bg-destructive/90 px-4 py-1.5 text-[10px] uppercase tracking-[0.22em] text-destructive-foreground font-semibold shadow-md">
                Out of Stock
              </span>
            )}
            {status === "coming_soon" && (
              <span className="absolute left-5 top-5 rounded-full bg-gold px-4 py-1.5 text-[10px] uppercase tracking-[0.22em] text-brand-soft font-semibold gold-frame shadow-md">
                Coming Soon
              </span>
            )}
            <span className="absolute bottom-5 left-5 rounded-full bg-background/85 px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {current.label}
            </span>
          </div>

          <div className="flex gap-3 sm:w-24 sm:flex-col">
            {gallery.map((view, i) => (
              <button
                key={view.url}
                type="button"
                onClick={() => setActive(i)}
                aria-label={view.label}
                aria-current={i === active}
                className={`overflow-hidden rounded-2xl border transition-all ${
                  i === active
                    ? "border-brand opacity-100"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={view.url}
                  alt={`${saree.name} — ${view.label.toLowerCase()} thumbnail`}
                  width={96}
                  height={128}
                  loading="lazy"
                  className="h-24 w-20 object-cover sm:h-28 sm:w-full"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="lg:pt-6">
          <p className="text-[11px] uppercase tracking-[0.24em] text-gold">{saree.weave}</p>
          <h1 className="mt-3 font-display text-4xl leading-tight text-brand-soft">{saree.name}</h1>
          <p className="mt-4 font-display text-2xl tabular-nums">{formatPrice(saree.price)}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Inclusive of taxes · Free insured shipping
          </p>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
            {saree.blurb}
          </p>

          <dl className="mt-8 space-y-3 rounded-xl border border-border bg-card p-6 text-sm">
            <div className="flex gap-4">
              <dt className="w-24 shrink-0 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Fabric
              </dt>
              <dd>{saree.fabric}</dd>
            </div>
            <div className="flex gap-4">
              <dt className="w-24 shrink-0 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Blouse
              </dt>
              <dd>{saree.blouse}</dd>
            </div>
            <div className="flex gap-4">
              <dt className="w-24 shrink-0 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Care
              </dt>
              <dd>{saree.care}</dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-col gap-4">
            {status === "in_stock" ? (
              <>
                <div className="flex items-center gap-4">
                  <QuantityStepper value={qty} onChange={(n) => setQty(Math.max(1, n))} />
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex-1 rounded-full border border-brand px-8 py-3 text-[11px] uppercase tracking-[0.22em] text-brand transition-colors hover:bg-brand hover:text-primary-foreground"
                  >
                    Add to bag
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleBookNow}
                  className="w-full rounded-full bg-brand px-8 py-3 text-[11px] uppercase tracking-[0.22em] text-primary-foreground transition-colors hover:bg-brand-soft"
                >
                  Book now
                </button>
              </>
            ) : status === "out_of_stock" ? (
              <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <h3 className="mt-3 font-display text-lg font-medium text-foreground">
                  Currently Out of Stock
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  This handwoven masterpiece is currently off the loom. Leave your contact to get notified when restocked.
                </p>
                <button
                  type="button"
                  onClick={() => setShowNotifyModal(true)}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-destructive px-8 py-3 text-[11px] uppercase tracking-[0.22em] text-destructive-foreground transition-colors hover:bg-destructive/90 shadow-md"
                >
                  <Bell className="h-4 w-4" />
                  Notify Me When Restocked
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border border-gold/40 bg-gold/10 p-6 text-center gold-frame">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gold/20 text-brand-soft">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="mt-3 font-display text-lg font-medium text-brand-soft">
                  On The Loom — Launching Soon
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Master artisans are currently weaving this creation. Register interest to reserve priority booking upon release.
                </p>
                <button
                  type="button"
                  onClick={() => setShowNotifyModal(true)}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-8 py-3 text-[11px] uppercase tracking-[0.22em] text-primary-foreground transition-colors hover:bg-brand-soft shadow-md"
                >
                  <Bell className="h-4 w-4 text-gold" />
                  Notify Me On Launch
                </button>
              </div>
            )}
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 text-center">
            {[
              { k: "14 days", v: "Loom to door" },
              { k: "7 days", v: "Easy exchange" },
              { k: "Certified", v: "Handloom mark" },
            ].map((f) => (
              <div key={f.k} className="rounded-lg bg-cream px-3 py-4">
                <p className="font-display text-base text-brand-soft">{f.k}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  {f.v}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="mt-24">
        <h2 className="font-display text-3xl text-brand-soft">You may also like</h2>
        <div className="ornament-rule mt-4 w-32" />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {related.map((item) => (
            <SareeCard key={item.slug} saree={item} />
          ))}
        </div>
      </section>

      {/* NOTIFY REQUEST MODAL */}
      {showNotifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-gold/30 bg-background p-6 sm:p-8 shadow-2xl">
            {notifySubmitted ? (
              <div className="text-center py-6">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Check className="h-7 w-7" />
                </div>
                <h3 className="mt-4 font-display text-2xl text-brand-soft">Request Registered</h3>
                <p className="mt-2 text-xs text-muted-foreground">
                  We have added your details to the studio priority list. Our master weaver concierge will contact you immediately upon availability.
                </p>
              </div>
            ) : (
              <form onSubmit={handleNotifySubmit} className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-gold">Priority Alert</p>
                    <h3 className="font-display text-xl text-brand-soft">
                      {status === "coming_soon" ? "Coming Soon Notification" : "Restock Alert Request"}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowNotifyModal(false)}
                    className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-xs leading-relaxed text-muted-foreground">
                  Enter your email and phone number to receive instant notification for{" "}
                  <span className="font-medium text-foreground">{saree.name}</span>.
                </p>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="your.email@example.com"
                      value={notifyEmail}
                      onChange={(e) => setNotifyEmail(e.target.value)}
                      className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-1">
                      Phone / WhatsApp (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={notifyPhone}
                      onChange={(e) => setNotifyPhone(e.target.value)}
                      className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-gold"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowNotifyModal(false)}
                    className="rounded-full px-5 py-2.5 text-xs text-muted-foreground hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-brand px-6 py-2.5 text-[11px] uppercase tracking-[0.2em] text-primary-foreground hover:bg-brand-soft shadow-md"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}