import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <div className="sticky top-0 z-40">
      <div className="bg-brand-soft text-center text-[10px] uppercase tracking-[0.3em] text-primary-foreground">
        <p className="px-4 py-2">
          Complimentary insured shipping across India · Handwoven to order
        </p>
      </div>
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-[1400px] items-center px-5 lg:px-8">
          <Link to="/" className="flex min-w-0 items-center">
            <img
              src="/logo/BRAND IDENTITY.png"
              alt="Kadha Atelier"
              width={160}
              height={44}
              className="h-10 w-auto object-contain sm:h-12"
            />
          </Link>
        </div>
      </header>
    </div>
  );
}