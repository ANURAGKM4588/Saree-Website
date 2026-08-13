import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { formatPrice, getSaree } from "@/data/sarees";
import { useCart } from "@/lib/cart";
import { useShopStore, type Order } from "@/lib/shop-store";
import { useAuth } from "@/lib/auth";
import { sendOrderConfirmationEmail } from "@/lib/email-service";
import { openRazorpayCheckout } from "@/lib/razorpay";
import { CheckCircle2, Mail, ShieldCheck, User, MapPin, Sparkles, CreditCard, Lock } from "lucide-react";

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title: "Book Your Saree | Kadha Sarees" },
      {
        name: "description",
        content:
          "Share your delivery details and confirm your Kadha saree booking. Secure Razorpay UPI & Card payment options.",
      },
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
  const { user, addSavedAddress } = useAuth();
  const [bookedOrder, setBookedOrder] = useState<Order | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Payment Method Selection State: "razorpay" (default) or "cod"
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">("razorpay");

  // Form controlled state for auto-fill & address selector
  const [nameVal, setNameVal] = useState(user?.name || "");
  const [phoneVal, setPhoneVal] = useState(user?.phone || "");
  const [emailVal, setEmailVal] = useState(user?.email || "");
  const [selectedAddressId, setSelectedAddressId] = useState<string>("new");
  const [addressVal, setAddressVal] = useState("");
  const [addressLabelVal, setAddressLabelVal] = useState("Home Address");
  const [saveAddressChecked, setSaveAddressChecked] = useState(true);

  // Auto-select primary address when user is logged in
  useEffect(() => {
    if (user) {
      setNameVal(user.name);
      setEmailVal(user.email);
      setPhoneVal(user.phone || "");
      if (user.addresses.length > 0) {
        const primary = user.addresses.find((a) => a.isPrimary) || user.addresses[0];
        setSelectedAddressId(primary.id);
        setAddressVal(primary.address);
      } else {
        setSelectedAddressId("new");
        setAddressVal("");
      }
    }
  }, [user]);

  const items = lines.flatMap((line) => {
    const saree = getSaree(line.slug);
    return saree ? [{ ...line, saree }] : [];
  });
  const total = items.reduce((sum, i) => sum + i.saree.price * i.qty, 0);

  const processOrderCreation = (
    customerName: string,
    phone: string,
    email: string,
    address: string,
    notes?: string,
    paymentId?: string
  ) => {
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
      status: paymentId ? "Processing" : "Pending",
      paymentId: paymentId,
      paymentStatus: paymentId ? "Paid" : "Pending",
    });

    // Save address for future orders if checked and logged in
    if (user && saveAddressChecked && address) {
      const exists = user.addresses.some((a) => a.address.trim() === address.trim());
      if (!exists) {
        addSavedAddress({
          label: addressLabelVal || "Saved Shipping Address",
          name: customerName,
          phone: phone,
          address: address,
          isPrimary: user.addresses.length === 0,
        });
      }
    }

    // Trigger Automated Email Dispatch directly to customer's email address
    sendOrderConfirmationEmail(newOrder);

    clear();
    setBookedOrder(newOrder);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const customerName = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const address = formData.get("address") as string;
    const notes = (formData.get("notes") as string) || undefined;

    if (paymentMethod === "razorpay") {
      setIsProcessingPayment(true);
      openRazorpayCheckout({
        amountInRupees: total,
        customerName,
        customerEmail: email,
        customerPhone: phone,
        orderNotes: notes,
        onSuccess: (payment) => {
          setIsProcessingPayment(false);
          processOrderCreation(customerName, phone, email, address, notes, payment.razorpay_payment_id);
        },
        onFailure: (err) => {
          setIsProcessingPayment(false);
          if (err?.reason !== "Payment cancelled by user") {
            alert("Payment failed or was interrupted. Please try again.");
          }
        },
      });
    } else {
      processOrderCreation(customerName, phone, email, address, notes);
    }
  };

  if (bookedOrder) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center animate-in fade-in">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shadow-md">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold font-bold mt-6">Booking Confirmed</p>
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
              ● Reserved & {bookedOrder.paymentStatus === "Paid" ? "Paid" : "Confirmed"}
            </span>
          </div>

          {bookedOrder.paymentId && (
            <div className="flex items-center justify-between rounded-2xl bg-emerald-500/10 p-3.5 border border-emerald-600/20 text-xs">
              <span className="font-semibold text-emerald-900 flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-emerald-700" /> Razorpay Payment Receipt ID:
              </span>
              <span className="font-mono font-bold text-emerald-800">{bookedOrder.paymentId}</span>
            </div>
          )}

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
              <span>Our studio concierge will call or WhatsApp you on <strong>{bookedOrder.phone}</strong> to confirm dispatch details.</span>
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold">Studio Booking</p>
          <h1 className="mt-2 font-display text-4xl text-brand-soft">Confirm Saree Booking</h1>
        </div>

        {/* User Auth Quick Banner */}
        {user ? (
          <div className="inline-flex items-center gap-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-600/20 px-4 py-2 text-xs font-semibold text-emerald-900">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            <span>Signed in as <strong>{user.name}</strong> (Details auto-filled)</span>
          </div>
        ) : (
          <Link
            to="/login"
            search={{ redirect: "/booking" }}
            className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-cream/40 px-5 py-2 text-xs font-semibold text-brand-soft hover:bg-gold/20 transition-colors shadow-2xs"
          >
            <User className="h-4 w-4 text-gold" />
            <span>Sign in to auto-fill saved address</span>
          </Link>
        )}
      </div>
      <div className="ornament-rule mt-4 w-32" />

      <div className="mt-12 grid gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        <form className="space-y-7" onSubmit={handleSubmit}>
          {/* Address Selection Option (Previous Address vs New Address) */}
          {user && user.addresses.length > 0 ? (
            <div className="rounded-3xl border border-gold/40 bg-cream/30 p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-gold/20 pb-3">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-soft flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-gold" /> Select Delivery Address:
                </span>
                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-500/15 px-2.5 py-0.5 rounded-full">
                  Auto-Selected Previous Address
                </span>
              </div>

              <div className="space-y-3">
                {/* Option 1: Saved Previous Addresses Dropdown */}
                <label className="flex items-start gap-3 p-3 rounded-2xl border border-border bg-card hover:border-gold/50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="addressOption"
                    value="saved"
                    checked={selectedAddressId !== "new"}
                    onChange={() => {
                      const primary = user.addresses.find((a) => a.isPrimary) || user.addresses[0];
                      if (primary) {
                        setSelectedAddressId(primary.id);
                        setAddressVal(primary.address);
                        if (primary.name) setNameVal(primary.name);
                        if (primary.phone) setPhoneVal(primary.phone);
                      }
                    }}
                    className="mt-1 h-4 w-4 accent-brand"
                  />
                  <div className="flex-1 space-y-2">
                    <span className="text-xs font-semibold text-foreground">Use Previously Saved Delivery Address</span>
                    <select
                      value={selectedAddressId === "new" ? user.addresses[0]?.id : selectedAddressId}
                      onChange={(e) => {
                        setSelectedAddressId(e.target.value);
                        const selected = user.addresses.find((a) => a.id === e.target.value);
                        if (selected) {
                          setAddressVal(selected.address);
                          if (selected.name) setNameVal(selected.name);
                          if (selected.phone) setPhoneVal(selected.phone);
                        }
                      }}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium text-foreground outline-none focus:border-gold"
                    >
                      {user.addresses.map((addr) => (
                        <option key={addr.id} value={addr.id}>
                          {addr.isPrimary ? "★ Primary: " : ""}{addr.label} ({addr.name} — {addr.address.substring(0, 40)}...)
                        </option>
                      ))}
                    </select>
                  </div>
                </label>

                {/* Option 2: Add New Address */}
                <label className="flex items-center gap-3 p-3 rounded-2xl border border-border bg-card hover:border-gold/50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="addressOption"
                    value="new"
                    checked={selectedAddressId === "new"}
                    onChange={() => {
                      setSelectedAddressId("new");
                      setAddressVal("");
                    }}
                    className="h-4 w-4 accent-brand"
                  />
                  <span className="text-xs font-semibold text-brand-soft">+ Enter a New Delivery Address</span>
                </label>
              </div>
            </div>
          ) : null}

          <div>
            <label className={label} htmlFor="name">
              Full name *
            </label>
            <input
              id="name"
              name="name"
              required
              placeholder="Your Name"
              className={field}
              value={nameVal}
              onChange={(e) => setNameVal(e.target.value)}
            />
          </div>
          <div className="grid gap-7 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="phone">
                Phone Number *
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="+91 98765 43210"
                className={field}
                value={phoneVal}
                onChange={(e) => setPhoneVal(e.target.value)}
              />
            </div>
            <div>
              <label className={label} htmlFor="email">
                Email Address (For Booking Receipt) *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="your.email@example.com"
                className={field}
                value={emailVal}
                onChange={(e) => setEmailVal(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className={label} htmlFor="address">
              Delivery Address *
            </label>
            <textarea
              id="address"
              name="address"
              rows={3}
              required
              placeholder="Full shipping address inside Kerala / India"
              className={field}
              value={addressVal}
              onChange={(e) => setAddressVal(e.target.value)}
            />
          </div>

          {user && (
            <div className="space-y-3 rounded-2xl bg-muted/40 p-4 border border-border">
              <div className="flex items-center gap-2.5 text-xs text-foreground font-medium">
                <input
                  type="checkbox"
                  id="save-address-chk"
                  checked={saveAddressChecked}
                  onChange={(e) => setSaveAddressChecked(e.target.checked)}
                  className="h-4 w-4 accent-brand rounded border-border"
                />
                <label htmlFor="save-address-chk" className="cursor-pointer">
                  Save this delivery address to my account for future saree bookings
                </label>
              </div>

              {saveAddressChecked && selectedAddressId === "new" && (
                <div className="pl-6 animate-in fade-in">
                  <label className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground font-semibold block mb-1">
                    Address Label (e.g. Home, Office, Parents)
                  </label>
                  <input
                    type="text"
                    value={addressLabelVal}
                    onChange={(e) => setAddressLabelVal(e.target.value)}
                    placeholder="Home Address"
                    className="w-full sm:w-64 rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-gold"
                  />
                </div>
              )}
            </div>
          )}

          <div>
            <label className={label} htmlFor="notes">
              Notes for the studio (Optional)
            </label>
            <input id="notes" name="notes" placeholder="Special stitching or delivery instructions..." className={field} />
          </div>

          {/* Payment Method Selector */}
          <div className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-xs">
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-brand-soft block border-b border-border pb-3">
              Payment Gateway Selection:
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === "razorpay"
                    ? "border-emerald-600 bg-emerald-500/10 shadow-xs"
                    : "border-border bg-background hover:border-gold/50"
                }`}
              >
                <input
                  type="radio"
                  name="paymentChoice"
                  value="razorpay"
                  checked={paymentMethod === "razorpay"}
                  onChange={() => setPaymentMethod("razorpay")}
                  className="mt-1 h-4 w-4 accent-emerald-700"
                />
                <div>
                  <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <CreditCard className="h-4 w-4 text-emerald-700" /> Razorpay Instant Payment
                  </span>
                  <p className="text-[11px] text-emerald-800/90 mt-1 leading-relaxed">
                    UPI, Google Pay, PhonePe, Cards & NetBanking. Secured with 256-bit SSL encryption.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === "cod"
                    ? "border-emerald-600 bg-emerald-500/10 shadow-xs"
                    : "border-border bg-background hover:border-gold/50"
                }`}
              >
                <input
                  type="radio"
                  name="paymentChoice"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="mt-1 h-4 w-4 accent-emerald-700"
                />
                <div>
                  <span className="text-xs font-bold text-foreground">Studio Order Reservation</span>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                    Reserve order now. Studio concierge will contact you to verify delivery.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isProcessingPayment}
              className="w-full sm:w-auto rounded-full bg-brand px-10 py-3.5 text-[11px] uppercase tracking-[0.22em] font-semibold text-primary-foreground transition-colors hover:bg-brand-soft shadow-md cursor-pointer whitespace-nowrap"
            >
              {isProcessingPayment
                ? "Opening Razorpay Gateway..."
                : paymentMethod === "razorpay"
                ? `Proceed to Pay ${formatPrice(total)} via Razorpay →`
                : "Confirm Saree Booking →"}
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