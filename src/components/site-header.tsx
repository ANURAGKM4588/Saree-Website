import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { useCart } from "@/lib/cart";
import { ShoppingBag, Menu, X, MessageSquare } from "lucide-react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Saree Catalog" },
  { to: "/booking", label: "Checkout" },
  { to: "/about", label: "About Us" },
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
      {/* Top E-Commerce Announcement Bar */}
      <div className="bg-brand-soft text-center text-[10px] uppercase tracking-[0.22em] text-primary-foreground">
        <div className="mx-auto max-w-[1400px] px-4 py-2 flex items-center justify-center gap-3 font-medium flex-wrap">
          <span>Complimentary Insured Delivery Across Kerala & India</span>
          <span className="hidden sm:inline text-gold">·</span>
          <a
            href="https://wa.me/918075676393"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-gold font-semibold hover:underline"
          >
            <MessageSquare className="h-3 w-3" /> WhatsApp Order: +91 8075676393
          </a>
        </div>
      </div>

      {/* Main E-Commerce Navigation Bar */}
      <header className="border-b border-border bg-background/95 backdrop-blur shadow-xs">
        <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-5 lg:px-8">
          {/* Brand Logo */}
          <Link to="/" className="flex min-w-0 items-center">
            <img
              src="/logo/BRAND IDENTITY.png"
              alt="Kadha Atelier Saree Store"
              width={160}
              height={44}
              className="h-10 w-auto object-contain sm:h-12"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-8 text-[11px] uppercase tracking-[0.18em] sm:flex">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`transition-colors whitespace-nowrap font-medium ${
                    isActive ? "text-brand font-semibold border-b-2 border-gold pb-1" : "text-muted-foreground hover:text-brand"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Shopping Bag Button */}
          <div className="hidden sm:flex items-center gap-4">
            <Link
              id="header-bag-btn"
              to="/bag"
              className="inline-flex shrink-0 items-center gap-2.5 rounded-full bg-brand px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] font-semibold text-primary-foreground transition-all duration-300 hover:bg-brand-soft whitespace-nowrap shadow-md cursor-pointer transform-gpu"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Bag</span>
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-brand-soft">
                {count}
              </span>
            </Link>
          </div>

          {/* Mobile Right Bar: Shopping Bag + Mobile Menu Toggle */}
          <div className="flex items-center gap-3 sm:hidden">
            <Link
              id="header-bag-btn-mobile"
              to="/bag"
              className="relative inline-flex items-center justify-center rounded-full bg-brand/10 p-2 text-brand hover:bg-brand/20 transition-all duration-300 transform-gpu"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[9px] font-bold text-brand-soft shadow-xs">
                  {count}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-foreground transition-colors hover:bg-accent hover:text-foreground cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
                  className="flex items-center justify-between rounded-xl bg-brand px-5 py-3 text-primary-foreground font-semibold"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4" /> Shopping Bag
                  </span>
                  <span className="rounded-full bg-gold px-2.5 py-0.5 text-[10px] font-bold text-brand-soft">
                    {count} items
                  </span>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>
    </div>
  );
}