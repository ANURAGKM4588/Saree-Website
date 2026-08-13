import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { formatPrice, getSaree } from "@/data/sarees";
import { useCart } from "@/lib/cart";
import { useShopStore, type Order } from "@/lib/shop-store";
import { sendOrderConfirmationEmail } from "@/lib/email-service";
import { CheckCircle2, Mail, ShieldCheck } from "lucide-react";

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
  "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-gold";
const label = "text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-semibold";

function Booking() {
  const { lines, clear } = useCart();
  const { createOrder } = useShopStore();
  const [bookedOrder, setBookedOrder] = useState<Order | null>(null);

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

    const newOrder = createOrder({
      customerName,
      phone,
      email,
      address,
      notes,
      items: orderItems,
      total,
    });

    // Trigger Automated Email Dispatch directly to customer's email address
    sendOrderConfirmationEmail(newOrder);

    clear();
    setBookedOrder(newOrder);
  };

  if (bookedOrder) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center animate-in fade-in">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shadow-md">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <p className="mt-6 text-[11px] uppercase tracking-[0.3em] text-gold font-bold">Booking Confirmed</p>
        <h1 className="mt-3 font-display text-4xl leading-tight text-brand-soft">
          Thank you, {bookedOrder.customerName}. Your saree is reserved.
        </h1>
        
        {/* Booking ID & Automated Email Badge Box */}
        <div className="mt-8 rounded-3xl border border-gold/30 bg-card p-6 sm:p-8 text-left shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Booking ID</p>
              <span className="font-mono text-xl font-bold text-gold">{bookedOrder.id}</span>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-700">
              ● Reserved
            </span>
          </div>

          <div className="flex items-start gap-3 rounded-2xl bg-emerald-500/10 p-4 border border-emerald-600/20">
            <Mail className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-emerald-900">Automated Confirmation Email Dispatched</p>
              <p className="mt-0.5 text-xs text-emerald-800/90 leading-relaxed">
                An official transactional booking receipt with Booking ID <strong className="font-mono">{bookedOrder.id}</strong> has been sent to <strong>{bookedOrder.email}</strong>.
              </p>
            </div>
          </div>

          <div className="text-xs text-muted-foreground space-y-2 pt-2">
            <p className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-gold shrink-0" />
              <span>Our studio concierge will call or WhatsApp you within 1 working day on <strong>{bookedOrder.phone}</strong> to confirm drape choices and delivery.</span>
            </p>
          </div>
        </div>

        <Link
          to="/shop"
          className="mt-10 inline-block rounded-full bg-brand px-10 py-3.5 text-[11px] uppercase tracking-[0.22em] font-semibold text-primary-foreground transition-colors hover:bg-brand-soft shadow-md"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-6 py-28 text-center">
        <h1 className="font-display text-3xl">Nothing to book yet</h1>
        <p className="mt-3 text-xs text-muted-foreground">Your shopping bag is currently empty.</p>
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
      <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold">Studio Booking</p>
      <h1 className="mt-2 font-display text-4xl text-brand-soft">Confirm Saree Booking</h1>
      <div className="ornament-rule mt-4 w-32" />

      <div className="mt-12 grid gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        <form className="space-y-7" onSubmit={handleSubmit}>
          <div>
            <label className={label} htmlFor="name">
              Full name *
            </label>
            <input id="name" name="name" required placeholder="Your Name" className={field} />
          </div>
          <div className="grid gap-7 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="phone">
                Phone Number *
              </label>
              <input id="phone" name="phone" type="tel" required placeholder="+91 98765 43210" className={field} />
            </div>
            <div>
              <label className={label} htmlFor="email">
                Email Address (For Booking Receipt) *
              </label>
              <input id="email" name="email" type="email" required placeholder="your.email@example.com" className={field} />
            </div>
          </div>
          <div>
            <label className={label} htmlFor="address">
              Delivery Address *
            </label>
            <textarea id="address" name="address" rows={3} required placeholder="Full shipping address inside Kerala / India" className={field} />
          </div>
          <div>
            <label className={label} htmlFor="notes">
              Notes for the studio (Optional)
            </label>
            <input id="notes" name="notes" placeholder="Special stitching or delivery instructions..." className={field} />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto rounded-full bg-brand px-10 py-3.5 text-[11px] uppercase tracking-[0.22em] font-semibold text-primary-foreground transition-colors hover:bg-brand-soft shadow-md cursor-pointer whitespace-nowrap"
            >
              Confirm Booking & Send Receipt →
            </button>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              ✓ An automated booking receipt with your unique Booking ID will be sent directly to your email.
            </p>
          </div>
        </form>

        {/* Order Summary Sidebar */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 h-fit shadow-xs">
          <h2 className="font-display text-xl text-brand-soft border-b border-border pb-4">
            Booking Summary ({items.length} Saree{items.length > 1 ? "s" : ""})
          </h2>

          <ul className="divide-y divide-border space-y-4">
            {items.map((item) => (
              <li key={item.slug} className="flex items-center gap-4 pt-4 first:pt-0">
                <img
                  src={item.saree.image}
                  alt={item.saree.name}
                  width={60}
                  height={80}
                  className="h-16 w-12 rounded-xl object-cover bg-secondary border border-border shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-display text-sm font-semibold truncate text-foreground">{item.saree.name}</p>
                  <p className="text-xs text-muted-foreground">Qty: {item.qty} × {formatPrice(item.saree.price)}</p>
                </div>
                <span className="font-display text-sm font-bold tabular-nums text-brand-soft">
                  {formatPrice(item.saree.price * item.qty)}
                </span>
              </li>
            ))}
          </ul>

          <div className="border-t border-border pt-4 space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Insured Express Shipping</span>
              <span className="font-semibold text-emerald-700 uppercase">Free</span>
            </div>
            <div className="flex justify-between items-center text-base font-bold text-foreground border-t border-border/60 pt-3">
              <span>Total Payable:</span>
              <span className="font-display text-2xl text-brand-soft tabular-nums">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}