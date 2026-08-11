import { createFileRoute, Link } from "@tanstack/react-router";
import { QuantityStepper } from "@/components/quantity-stepper";
import { formatPrice, getSaree } from "@/data/sarees";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/bag")({
  head: () => ({
    meta: [
      { title: "Your Bag | Kadha" },
      {
        name: "description",
        content: "Review the sarees in your Kadha bag and continue to booking.",
      },
      { property: "og:title", content: "Your Bag | Kadha" },
      { property: "og:description", content: "Review your selected Kadha sarees." },
    ],
  }),
  component: Bag,
});

function Bag() {
  const { lines, setQty, remove } = useCart();
  const items = lines.flatMap((line) => {
    const saree = getSaree(line.slug);
    return saree ? [{ ...line, saree }] : [];
  });
  const subtotal = items.reduce((sum, i) => sum + i.saree.price * i.qty, 0);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Your selection</p>
      <h1 className="mt-3 font-display text-4xl text-brand-soft">Your bag</h1>
      <div className="ornament-rule mt-4 w-32" />

      {items.length === 0 ? (
        <div className="mt-8">
          <p className="text-sm text-muted-foreground">Your bag is empty.</p>
          <Link
            to="/shop"
            className="mt-6 inline-block rounded-full border border-brand px-8 py-3 text-[11px] uppercase tracking-[0.22em] text-brand transition-colors hover:bg-brand hover:text-primary-foreground"
          >
            Browse sarees
          </Link>
        </div>
      ) : (
        <>
          <ul className="mt-10 divide-y divide-border rounded-xl border border-border bg-card px-6">
            {items.map((item) => (
              <li key={item.slug} className="flex gap-6 py-6">
                <img
                  src={item.saree.image}
                  alt={item.saree.name}
                  width={912}
                  height={1200}
                  loading="lazy"
                  className="h-32 w-24 shrink-0 rounded-lg bg-secondary object-cover"
                />
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex justify-between gap-4">
                    <div>
                      <p className="font-display text-lg">{item.saree.name}</p>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        {item.saree.weave}
                      </p>
                    </div>
                    <p className="text-sm tabular-nums">
                      {formatPrice(item.saree.price * item.qty)}
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <QuantityStepper value={item.qty} onChange={(n) => setQty(item.slug, n)} />
                    <button
                      type="button"
                      onClick={() => remove(item.slug)}
                      className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-destructive"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex items-center justify-between rounded-xl bg-cream px-6 py-5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Subtotal</p>
            <p className="font-display text-2xl tabular-nums text-brand-soft">{formatPrice(subtotal)}</p>
          </div>

          <Link
            to="/booking"
            className="mt-8 inline-block rounded-full bg-brand px-10 py-3 text-[11px] uppercase tracking-[0.22em] text-primary-foreground transition-colors hover:bg-brand-soft"
          >
            Proceed to booking
          </Link>
        </>
      )}
    </div>
  );
}