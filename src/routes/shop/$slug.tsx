import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { QuantityStepper } from "@/components/quantity-stepper";
import { SareeCard } from "@/components/saree-card";
import { formatPrice, getSaree, sarees, type SareeView } from "@/data/sarees";
import { useCart } from "@/lib/cart";
import { useShopStore } from "@/lib/shop-store";
import { triggerFlyToCartAnimation } from "@/lib/fly-to-cart";
import {
  Bell,
  Check,
  Sparkles,
  AlertCircle,
  Truck,
  MessageSquare,
  ShieldCheck,
  Droplets,
  Video,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Award,
  Scissors,
  Headphones,
} from "lucide-react";

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

  // Lock background page scroll when modal is open
  useEffect(() => {
    if (showNotifyModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showNotifyModal]);

  const mainImgRef = useRef<HTMLImageElement>(null);

  const gallery: SareeView[] =
    storedProduct?.views && storedProduct.views.length > 0 ? storedProduct.views : saree.views;
  const current: SareeView =
    gallery[Math.min(active, gallery.length - 1)] ?? { url: saree.image, label: "Full drape" };

  const related = sarees.filter((s) => s.slug !== saree.slug).slice(0, 3);

  const handleAddToCart = () => {
    triggerFlyToCartAnimation(mainImgRef.current);
    add(saree.slug, qty);
    incrementCartAdds(saree.slug, qty);
  };

  const handleBookNow = () => {
    triggerFlyToCartAnimation(mainImgRef.current);
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
        {/* LEFT COLUMN: PRODUCT IMAGE GALLERY & FULLY VISIBLE TERMS/POLICY BOX AT BOTTOM */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 sm:flex-row-reverse sm:items-start">
            <div className="relative flex-1 aspect-[3/4] overflow-hidden rounded-3xl bg-secondary">
              <img
                ref={mainImgRef}
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

          {/* TERMS, DELIVERY & CARE SECTION (FULL TIME VISIBLE STYLE AT BOTTOM OF PRODUCT IMAGE) */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 space-y-6 shadow-xs">
            <div className="border-b border-border pb-4 flex items-center justify-between">
              <h3 className="font-display text-base font-bold uppercase tracking-[0.18em] text-brand-soft flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-gold shrink-0" /> Terms, Delivery & Care
              </h3>
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                Kadha Guarantee
              </span>
            </div>

            <div className="space-y-6 text-xs">
              {/* Section 1: Delivery & Order Details */}
              <div className="space-y-2.5">
                <h4 className="font-display text-xs font-semibold text-brand-soft flex items-center gap-2 uppercase tracking-[0.14em]">
                  <Truck className="h-4 w-4 text-brand shrink-0" /> Delivery & Order Details
                </h4>
                <div className="space-y-2 text-muted-foreground pl-6">
                  <p className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong className="text-foreground font-semibold">Free Shipping:</strong> Complimentary shipping inside Kerala.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <Clock className="h-3.5 w-3.5 text-brand shrink-0 mt-0.5" />
                    <span><strong className="text-foreground font-semibold">Within Kerala:</strong> Max 7 working days delivery time.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <Clock className="h-3.5 w-3.5 text-brand shrink-0 mt-0.5" />
                    <span><strong className="text-foreground font-semibold">Outside Kerala:</strong> 10 – 15 working days insured dispatch.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <MessageSquare className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong className="text-foreground font-semibold">WhatsApp Direct Order:</strong> Send product screenshot to <a href="https://wa.me/918075676393" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline font-semibold">+91 8075676393</a>.</span>
                  </p>
                </div>
              </div>

              {/* Section 2: Return & Damage Claim Policy */}
              <div className="space-y-2.5 border-t border-border/60 pt-5">
                <h4 className="font-display text-xs font-semibold text-brand-soft flex items-center gap-2 uppercase tracking-[0.14em]">
                  <ShieldCheck className="h-4 w-4 text-gold shrink-0" /> Return & Damage Claim Policy
                </h4>
                <div className="space-y-2 text-muted-foreground pl-6">
                  <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-amber-950 text-[11px] font-medium leading-relaxed my-1">
                    ⚠️ <strong>Compulsory Requirement:</strong> Opening / unboxing video is strictly compulsory for damage replacement claims. Continuous video showing package seal unboxing to product inspection.
                  </div>
                  <p className="flex items-start gap-2 pt-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-foreground shrink-0 mt-0.5" />
                    <span><strong className="text-foreground font-semibold">Damage Claims:</strong> Returns accepted strictly for transit-damaged pieces reported within 48 hours.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <AlertCircle className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                    <span><strong className="text-foreground font-semibold">No Other Exchange:</strong> No returns or exchanges for color choice or personal preference.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong className="text-foreground font-semibold">Colour Disclaimer:</strong> Slight colour variation may occur due to screen resolution & studio lighting.</span>
                  </p>
                </div>
              </div>

              {/* Section 3: Wash & Fabric Care Instructions */}
              <div className="space-y-2.5 border-t border-border/60 pt-5">
                <h4 className="font-display text-xs font-semibold text-brand-soft flex items-center gap-2 uppercase tracking-[0.14em]">
                  <Droplets className="h-4 w-4 text-blue-600 shrink-0" /> Wash & Fabric Care Instructions
                </h4>
                <div className="space-y-1.5 text-muted-foreground pl-6">
                  <p className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand shrink-0"></span>
                    <span>Dry clean recommended for first wash to preserve zari luster.</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand shrink-0"></span>
                    <span>Hand wash gently in cool water with mild silk detergent.</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand shrink-0"></span>
                    <span>Do not wring; dry flat in shade away from direct sunlight.</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand shrink-0"></span>
                    <span>Iron on low heat setting on reverse side of saree.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SAREE PRODUCT DETAILS, PRICE, ACTIONS, HIGHLIGHTS & NEW CRAFT GUARANTEE CARD */}
        <div className="lg:pt-6">
          <p className="text-[11px] uppercase tracking-[0.24em] text-gold">{saree.weave}</p>
          <h1 className="mt-3 font-display text-4xl leading-tight text-brand-soft">{saree.name}</h1>
          <p className="mt-4 font-display text-2xl tabular-nums">{formatPrice(saree.price)}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Inclusive of taxes · Free shipping inside Kerala
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
                    className="flex-1 rounded-full border border-brand px-8 py-3 text-[11px] uppercase tracking-[0.22em] text-brand transition-colors hover:bg-brand hover:text-primary-foreground cursor-pointer whitespace-nowrap"
                  >
                    Add to bag
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleBookNow}
                  className="w-full rounded-full bg-brand px-8 py-3 text-[11px] uppercase tracking-[0.22em] text-primary-foreground transition-colors hover:bg-brand-soft cursor-pointer shadow-md whitespace-nowrap"
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
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-destructive px-8 py-3 text-[11px] uppercase tracking-[0.22em] text-destructive-foreground transition-colors hover:bg-destructive/90 shadow-md cursor-pointer whitespace-nowrap"
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
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-8 py-3 text-[11px] uppercase tracking-[0.22em] text-primary-foreground transition-colors hover:bg-brand-soft shadow-md cursor-pointer whitespace-nowrap"
                >
                  <Bell className="h-4 w-4 text-gold" />
                  Notify Me On Launch
                </button>
              </div>
            )}

            {/* Direct WhatsApp Order Link */}
            <a
              href={`https://wa.me/918075676393?text=${encodeURIComponent(`Hi Kadha Sarees, I would like to order "${saree.name}" (${formatPrice(saree.price)}).`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-emerald-600/30 bg-emerald-500/10 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-800 transition-colors hover:bg-emerald-500/20 shadow-2xs whitespace-nowrap"
            >
              <MessageSquare className="h-4 w-4 text-emerald-600" />
              DM on WhatsApp to Order (+91 8075676393)
            </a>
          </div>

          {/* Highlights Badges */}
          <div className="mt-6 grid grid-cols-3 gap-2.5 text-center">
            <div className="rounded-xl border border-border bg-card p-3 shadow-2xs">
              <Truck className="mx-auto h-4 w-4 text-brand" />
              <p className="mt-1 font-display text-xs font-semibold text-brand-soft">Free Shipping</p>
              <p className="text-[10px] text-muted-foreground">Inside Kerala</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-3 shadow-2xs">
              <Clock className="mx-auto h-4 w-4 text-gold" />
              <p className="mt-1 font-display text-xs font-semibold text-brand-soft">7 Working Days</p>
              <p className="text-[10px] text-muted-foreground">Kerala Delivery</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-3 shadow-2xs">
              <Sparkles className="mx-auto h-4 w-4 text-amber-600" />
              <p className="mt-1 font-display text-xs font-semibold text-brand-soft">Limited Stock</p>
              <p className="text-[10px] text-muted-foreground">Book Yours Now</p>
            </div>
          </div>

          {/* NEW RIGHT-SIDE CATEGORY CARD: STUDIO CRAFT GUARANTEE & AUTHENTICITY */}
          <div className="mt-6 rounded-3xl border border-gold/30 bg-cream/40 p-6 space-y-4 shadow-2xs">
            <div className="border-b border-gold/20 pb-3 flex items-center justify-between">
              <h3 className="font-display text-xs font-bold uppercase tracking-[0.18em] text-brand-soft flex items-center gap-2">
                <Award className="h-4 w-4 text-gold shrink-0" /> Studio Craft & Heritage Guarantee
              </h3>
              <span className="text-[9px] font-bold uppercase tracking-wider text-gold bg-gold/10 border border-gold/30 px-2.5 py-0.5 rounded-full">
                100% Genuine
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gold/15 text-brand-soft shrink-0 mt-0.5">
                  <Sparkles className="h-4 w-4 text-gold" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Handloom Artisan Heritage</h4>
                  <p className="mt-0.5 text-[11px] text-muted-foreground leading-relaxed">
                    Directly sourced from master weavers in Kerala & South India with authentic zari detailing.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-gold/15 pt-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700 shrink-0 mt-0.5">
                  <Scissors className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Custom Blouse Stitching</h4>
                  <p className="mt-0.5 text-[11px] text-muted-foreground leading-relaxed">
                    Custom tailor measurements & neck designs available on request via WhatsApp concierge.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-gold/15 pt-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand/10 text-brand shrink-0 mt-0.5">
                  <Headphones className="h-4 w-4 text-brand" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Studio Concierge Support</h4>
                  <p className="mt-0.5 text-[11px] text-muted-foreground leading-relaxed">
                    Need assistance or video inspection of saree before booking? Call/WhatsApp <strong className="text-foreground">+91 8075676393</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RELATED SAREES SECTION */}
      <section className="mt-24">
        <div className="flex items-end justify-between border-b border-border pb-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-gold font-bold">Handwoven Collection</p>
            <h2 className="mt-1 font-display text-2xl font-semibold text-brand-soft">More Creations You May Love</h2>
          </div>
          <Link
            to="/shop"
            className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand hover:text-brand-soft flex items-center gap-1"
          >
            Explore Catalog →
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((item) => (
            <SareeCard key={item.slug} saree={item} />
          ))}
        </div>
      </section>

      {/* NOTIFY ME POPUP MODAL */}
      {showNotifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl border border-gold/30 bg-background p-6 sm:p-8 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowNotifyModal(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
            >
              ✕
            </button>

            {notifySubmitted ? (
              <div className="py-8 text-center animate-in zoom-in-95">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                  <Check className="h-7 w-7 stroke-[3]" />
                </div>
                <h3 className="mt-4 font-display text-xl font-medium text-brand-soft">Priority Registration Logged</h3>
                <p className="mt-2 text-xs text-muted-foreground">
                  Our studio concierge will alert you the moment this masterpiece is off the loom.
                </p>
              </div>
            ) : (
              <form onSubmit={handleNotifySubmit} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gold/20 text-brand-soft">
                    <Bell className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold">Priority Studio Alert</p>
                    <h3 className="font-display text-lg font-semibold text-brand-soft">
                      {status === "coming_soon" ? "Register Launch Interest" : "Restock Notification"}
                    </h3>
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-muted-foreground">
                  Enter your contact details below to receive direct SMS & email alerts for <strong>{saree.name}</strong>.
                </p>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="your.email@example.com"
                    value={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.value)}
                    className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-xs text-foreground placeholder-muted-foreground outline-none focus:border-brand"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1">
                    WhatsApp / Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={notifyPhone}
                    onChange={(e) => setNotifyPhone(e.target.value)}
                    className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-xs text-foreground placeholder-muted-foreground outline-none focus:border-brand"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-brand py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-foreground hover:bg-brand-soft shadow-md cursor-pointer transition-colors"
                >
                  Confirm Priority Alert →
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}