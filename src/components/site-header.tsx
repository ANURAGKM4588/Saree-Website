import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { useCart } from "@/lib/cart";
import { ShoppingBag, Menu, X, Sparkles } from "lucide-react";

const navLinks = [
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "The House" },
  { to: "/booking", label: "Bespoke" },
];

export function SiteHeader() {
  const location = useLocation();
  const { count } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide site header on Admin panel
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="sticky top-0 z-40">
      {/* Announcement Bar */}
      <div className="bg-brand-soft text-center text-[10px] uppercase tracking-[0.3em] text-primary-foreground">
        <p className="px-4 py-2 flex items-center justify-center gap-2">
          <span>Complimentary insured shipping across India</span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">Handwoven to order</span>
        </p>
      </div>

      {/* Main Navigation Bar */}
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-5 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex min-w-0 items-center">
            <img
              src="/logo/BRAND IDENTITY.png"
              alt="Kadha Atelier"
              width={160}
              height={44}
              className="h-10 w-auto object-contain sm:h-12"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 text-[11px] uppercase tracking-[0.18em] sm:flex">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`transition-colors whitespace-nowrap ${
                    isActive ? "text-brand font-semibold" : "text-muted-foreground hover:text-brand"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            
            {/* Bag Button */}
            <Link
              to="/bag"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand px-4 py-2 text-primary-foreground transition-colors hover:bg-brand-soft whitespace-nowrap shadow-sm"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Bag</span>
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-brand-soft">
                {count}
              </span>
            </Link>
          </nav>

          {/* Mobile Right Bar: Bag + Hamburger Toggle */}
          <div className="flex items-center gap-3 sm:hidden">
            <Link
              to="/bag"
              className="relative inline-flex items-center justify-center p-2 text-foreground hover:text-brand"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[9px] font-bold text-brand-soft">
                  {count}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-foreground transition-colors hover:bg-accent hover:text-foreground cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="border-t border-border bg-background px-5 py-6 sm:hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col gap-4 text-xs uppercase tracking-[0.2em]">
              {navLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2 transition-colors ${
                    location.pathname === item.to
                      ? "font-bold text-brand"
                      : "text-foreground hover:text-brand"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
              <div className="my-2 border-t border-border pt-4 flex flex-col gap-3">
                <Link
                  to="/bag"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-lg bg-brand px-4 py-3 text-primary-foreground font-medium"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4" /> Shopping Bag
                  </span>
                  <span className="rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold text-brand-soft">
                    {count} items
                  </span>
                </Link>

                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-muted-foreground hover:text-brand"
                >
                  <Sparkles className="h-3.5 w-3.5 text-gold" /> Admin Panel
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>
    </div>
  );
}