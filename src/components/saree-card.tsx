import { useRef, useState, useEffect } from "react";
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
  const [currentViewIndex, setCurrentViewIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const stored = products.find((p) => p.slug === saree.slug);
  const status = stored?.status || "in_stock";
  const isInCart = lines.some((line) => line.slug === saree.slug);

  // Extract all product view images (Full drape, Model, Weave detail)
  const viewImages = saree.views && saree.views.length > 0 ? saree.views : [{ url: saree.image, label: "Full drape" }];
  const currentImage = viewImages[currentViewIndex]?.url || saree.image;
  const currentLabel = viewImages[currentViewIndex]?.label || "Full drape";

  // Auto-carousel on mouse hover
  useEffect(() => {
    if (!isHovered || viewImages.length <= 1) {
      setCurrentViewIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentViewIndex((prev) => (prev + 1) % viewImages.length);
    }, 1300);

    return () => clearInterval(interval);
  }, [isHovered, viewImages.length]);

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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-3xl bg-secondary">
        <img
          ref={imgRef}
          src={currentImage}
          alt={`${saree.name} — ${currentLabel}`}
          width={912}
          height={1200}
          loading="lazy"
          className={`w-full object-cover transition-all duration-[600ms] group-hover:scale-[1.05] ${
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

        {/* Hover View Indicator Pill & Dots */}
        {viewImages.length > 1 && (
          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-ink/75 backdrop-blur-xs px-2.5 py-1 transition-opacity duration-300">
            <span className="text-[9px] font-semibold uppercase tracking-wider text-primary-foreground hidden sm:inline mr-1">
              {currentLabel}
            </span>
            <div className="flex items-center gap-1">
              {viewImages.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentViewIndex ? "w-3 bg-gold" : "w-1.5 bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

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