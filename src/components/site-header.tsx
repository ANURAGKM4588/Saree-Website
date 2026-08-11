import { Link } from "@tanstack/react-router";
import { useCart } from "@/lib/cart";

const nav = [
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "The House" },
];

export function SiteHeader() {
  const { count } = useCart();

  return (
    <div className="sticky top-0 z-40">
      <div className="bg-brand-soft text-center text-[10px] uppercase tracking-[0.3em] text-primary-foreground">
        <p className="px-4 py-2">
          Complimentary insured shipping across India · Handwoven to order
        </p>
      </div>
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto grid h-[72px] max-w-[1400px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 lg:px-8">
          <Link to="/" className="flex min-w-0 items-center">
            <img
              src="/logo/BRAND IDENTITY.png"
              alt="Kadha Atelier"
              width={160}
              height={44}
              className="h-10 w-auto object-contain sm:h-12"
            />
          </Link>
          <nav className="flex items-center gap-5 text-[11px] uppercase tracking-[0.18em] sm:gap-8">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="hidden text-muted-foreground transition-colors hover:text-brand sm:block"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/bag"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand px-4 py-2 text-primary-foreground transition-colors hover:bg-brand-soft"
            >
              Bag
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[10px] font-semibold text-brand-soft">
                {count}
              </span>
            </Link>
          </nav>
        </div>
      </header>
    </div>
  );
}