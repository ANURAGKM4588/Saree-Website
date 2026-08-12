import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { formatPrice, getSaree } from "@/data/sarees";
import { useCart } from "@/lib/cart";
import { useShopStore } from "@/lib/shop-store";

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title: "Book Your Saree | Kadha" },
      {
        name: "description",
        content:
          "Share your delivery details and confirm your Kadha saree booking. Our studio confirms every order personally.",
      },
      { property: "og:title", content: "Book Your Saree | Kadha" },
      { property: "og:description", content: "Confirm your Kadha saree booking in one step." },
    ],
  }),
  component: Booking,
});

const field =
  "w-full rounded-lg border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-gold";
const label = "text-[11px] uppercase tracking-[0.18em] text-muted-foreground";

function Booking() {
  const { lines, clear } = useCart();
  const { createOrder } = useShopStore();
  const [done, setDone] = useState(false);

  const items = lines.flatMap((line) => {
    const saree = getSaree(line.slug);
    return saree ? [{ ...line, saree }] : [];
  });
  const total = items.reduce((sum, i) => sum + i.saree.price * i.qty, 0);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const customerName = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const address = formData.get("address") as string;
    const notes = (formData.get("notes") as string) || undefined;

    const orderItems = items.map((i) => ({
      slug: i.saree.slug,
      name: i.saree.name,
      qty: i.qty,
      price: i.saree.price,
      image: i.saree.image,
    }));

    createOrder({
      customerName,
      phone,
      email,
      address,
      notes,
      items: orderItems,
      total,
    });

    clear();
    setDone(true);
  };

  if (done) {
    return (
      <div className="mx-auto max-w-xl px-6 py-28 text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Booking received</p>
        <h1 className="mt-5 font-display text-4xl leading-tight">
          Thank you. Your saree is reserved.
        </h1>
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          Our studio will call you within one working day to confirm the drape, blouse measurements
          and delivery.
        </p>
        <Link
          to="/shop"
          className="mt-10 inline-block rounded-full border border-brand px-8 py-3 text-[11px] uppercase tracking-[0.22em] text-brand transition-colors hover:bg-brand hover:text-primary-foreground"
        >
          Continue browsing
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-6 py-28 text-center">
        <h1 className="font-display text-3xl">Nothing to book yet</h1>
        <Link
          to="/shop"
          className="mt-8 inline-block rounded-full border border-brand px-8 py-3 text-[11px] uppercase tracking-[0.22em] text-brand transition-colors hover:bg-brand hover:text-primary-foreground"
        >
          Browse sarees
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-display text-4xl">Booking</h1>
      <div className="mt-12 grid gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        <form className="space-y-7" onSubmit={handleSubmit}>
          <div>
            <label className={label} htmlFor="name">
              Full name
            </label>
            <input id="name" name="name" required className={field} />
          </div>
          <div className="grid gap-7 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="phone">
                Phone
              </label>
              <input id="phone" name="phone" type="tel" required className={field} />
            </div>
            <div>
              <label className={label} htmlFor="email">
                Email
              </label>
              <input id="email" name="email" type="email" required className={field} />
            </div>
          </div>
          <div>
            <label className={label} htmlFor="address">
              Delivery address
            </label>
            <textarea id="address" name="address" rows={3} required className={field} />
          </div>
          <div>
            <label className={label} htmlFor="notes">
              Notes for the studio
            </label>
            <input id="notes" name="notes" className={field} />
          </div>
          <button
            type="submit"
            className="bg-brand px-10 py-3 text-[11px] uppercase tracking-[0.22em] text-primary-foreground transition-colors hover:bg-brand-soft"
          >
            Confirm booking
          </button>
          <p className="text-xs leading-relaxed text-muted-foreground">
            No payment is taken here. We confirm availability by phone, then share a payment link.
          </p>
        </form>

        <aside className="border-t border-border pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
          <h2 className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Order summary
          </h2>
          <ul className="mt-6 space-y-4">
            {items.map((item) => (
              <li key={item.slug} className="flex justify-between gap-4 text-sm">
                <span>
                  {item.saree.name}
                  <span className="text-muted-foreground"> × {item.qty}</span>
                </span>
                <span className="tabular-nums">{formatPrice(item.saree.price * item.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex justify-between border-t border-border pt-4 text-sm">
            <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Total
            </span>
            <span className="tabular-nums">{formatPrice(total)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}