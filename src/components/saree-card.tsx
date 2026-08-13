import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { formatPrice, type Saree } from "@/data/sarees";
import { useShopStore } from "@/lib/shop-store";
import { useCart } from "@/lib/cart";
import { triggerFlyToCartAnimation } from "@/lib/fly-to-cart";
import { ShoppingBag, Check } from "lucide-react";

export function SareeCard({ saree, tall = false }: { saree: Saree; tall?: boolean }) {
  const { products, incrementCartAdds } = useShopStore();
  const { lines, add } = useCart();
  const [added, setAdded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const stored = products.find((p) => p.slug === saree.slug);
  const status = stored?.status || "in_stock";
  const isInCart = lines.some((line) => line.slug === saree.slug);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (status !== "in_stock") return;

    // Trigger macOS Genie Fly-to-Cart Animation
    triggerFlyToCartAnimation(imgRef.current);

    add(saree.slug);
    incrementCartAdds(saree.slug);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <Link
      to="/shop/$slug"
      params={{ slug: saree.slug }}
      className="group relative flex h-full flex-col"
    >
      <div className="relative overflow-hidden rounded-3xl bg-secondary">
        <img
          ref={imgRef}
          src={saree.image}
          alt={`${saree.name} — ${saree.weave} saree`}
          width={912}
          height={1200}
          loading="lazy"
          className={`w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.05] ${
            tall ? "aspect-[4/5]" : "aspect-[3/4]"
          }`}
        />
        
        {/* Status or Weave Badge */}
        <div className="absolute left-3 top-3 sm:left-4 sm:top-4 flex flex-col gap-1.5 items-start z-10">
          <span className="glass-panel rounded-full px-2.5 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-[10px] font-medium uppercase tracking-[0.16em] text-brand-soft whitespace-nowrap">
            {saree.weave}
          </span>
          {status === "out_of_stock" && (
            <span className="rounded-full bg-destructive/90 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[8px] sm:text-[9px] font-semibold uppercase tracking-[0.16em] text-destructive-foreground shadow-sm whitespace-nowrap">
              Out of Stock
            </span>
          )}
          {status === "coming_soon" && (
            <span className="rounded-full bg-gold px-2.5 py-0.5 sm:px-3 sm:py-1 text-[8px] sm:text-[9px] font-semibold uppercase tracking-[0.16em] text-brand-soft shadow-sm gold-frame whitespace-nowrap">
              Coming Soon
            </span>
          )}
        </div>

        {/* QUICK ADD TO CART BUTTON (Bottom-Right on Mobile, Top-Right on Desktop) */}
        <button
          type="button"
          onClick={handleQuickAdd}
          title={
            status !== "in_stock"
              ? status.replace("_", " ")
              : isInCart
              ? "Added to Bag (Click to add another)"
              : "Add Saree to Shopping Bag"
          }
          disabled={status !== "in_stock"}
          className={`absolute right-3 bottom-3 sm:top-4 sm:bottom-auto sm:right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border shadow-lg backdrop-blur-xs transition-all duration-300 cursor-pointer ${
            added || isInCart
              ? "bg-brand text-white border-brand scale-105 shadow-emerald-900/30"
              : status === "in_stock"
              ? "bg-white/95 text-brand border-gold/40 hover:bg-gold hover:text-brand-soft hover:scale-110 active:scale-95"
              : "bg-slate-200/80 text-slate-400 border-slate-300 cursor-not-allowed opacity-60"
          }`}
        >
          {added || isInCart ? (
            <Check className="h-5 w-5 stroke-[2.5] text-white animate-in zoom-in-50" />
          ) : (
            <ShoppingBag className="h-4 w-4" />
          )}
        </button>

        <span className="hidden sm:block absolute inset-x-4 bottom-4 translate-y-3 rounded-full bg-ink/90 py-3 text-center text-[11px] font-medium tracking-[0.06em] text-primary-foreground opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 whitespace-nowrap">
          {status === "out_of_stock" ? "Notify Me →" : status === "coming_soon" ? "View & Register →" : "View & book →"}
        </span>
      </div>

      <div className="flex flex-1 items-start justify-between gap-4 px-1 pt-4">
        <div className="min-w-0">
          <h3 className="truncate font-display text-lg font-medium leading-tight tracking-tight text-brand-soft">
            {saree.name}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground truncate">{saree.colour} · Handwoven</p>
        </div>
        <p className="shrink-0 font-display text-base font-medium tabular-nums text-foreground whitespace-nowrap">
          {formatPrice(saree.price)}
        </p>
      </div>
    </Link>
  );
}