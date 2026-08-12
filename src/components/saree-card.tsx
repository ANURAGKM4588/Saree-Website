import { Link } from "@tanstack/react-router";
import { formatPrice, type Saree } from "@/data/sarees";
import { useShopStore } from "@/lib/shop-store";

export function SareeCard({ saree, tall = false }: { saree: Saree; tall?: boolean }) {
  const { products } = useShopStore();
  const stored = products.find((p) => p.slug === saree.slug);
  const status = stored?.status || "in_stock";

  return (
    <Link
      to="/shop/$slug"
      params={{ slug: saree.slug }}
      className="group flex h-full flex-col"
    >
      <div className="relative overflow-hidden rounded-3xl bg-secondary">
        <img
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
        <div className="absolute left-4 top-4 flex flex-col gap-1.5 items-start">
          <span className="glass-panel rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-brand-soft whitespace-nowrap">
            {saree.weave}
          </span>
          {status === "out_of_stock" && (
            <span className="rounded-full bg-destructive/90 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-destructive-foreground shadow-sm whitespace-nowrap">
              Out of Stock
            </span>
          )}
          {status === "coming_soon" && (
            <span className="rounded-full bg-gold px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-brand-soft shadow-sm gold-frame whitespace-nowrap">
              Coming Soon
            </span>
          )}
        </div>

        <span className="absolute inset-x-4 bottom-4 translate-y-3 rounded-full bg-ink/90 py-3 text-center text-[11px] font-medium tracking-[0.06em] text-primary-foreground opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 whitespace-nowrap">
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