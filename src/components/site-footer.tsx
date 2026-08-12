import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-brand-soft text-primary-foreground">
      <div className="mx-auto max-w-[1400px] px-5 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <img
              src="/logo/BRAND IDENTITY white.png"
              alt="Kadha Atelier"
              width={160}
              height={50}
              loading="lazy"
              className="h-12 w-auto object-contain brightness-110"
            />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-primary-foreground/70">
              Handwoven sarees from family looms in Kanchipuram, Banaras and Chanderi — booked
              directly with the house.
            </p>
          </div>
          <nav className="flex flex-col gap-3 text-sm text-primary-foreground/75">
            <p className="font-display text-lg text-primary-foreground">Explore</p>
            <Link to="/shop" className="hover:text-gold">
              The Collection
            </Link>
            <Link to="/about" className="hover:text-gold">
              The House
            </Link>
            <Link to="/bag" className="hover:text-gold">
              Your Bag
            </Link>
            <Link to="/booking" className="hover:text-gold">
              Book a saree
            </Link>
            <Link to="/admin" className="hover:text-gold">
              Admin Dashboard
            </Link>
          </nav>
          <div className="flex flex-col gap-3 text-sm text-primary-foreground/75">
            <p className="font-display text-lg text-primary-foreground">Concierge</p>
            <a href="mailto:hello@kadha.in" className="hover:text-gold">
              hello@kadha.in
            </a>
            <a href="tel:+919000000000" className="hover:text-gold">
              +91 90000 00000
            </a>
            <p>Mon–Sat, 10am–7pm IST</p>
          </div>
        </div>
        <div className="mt-12 border-t border-primary-foreground/15 pt-6 text-[10px] uppercase tracking-[0.24em] text-primary-foreground/50">
          © {new Date().getFullYear()} Kadha · Handwoven in India
        </div>
      </div>
    </footer>
  );
}