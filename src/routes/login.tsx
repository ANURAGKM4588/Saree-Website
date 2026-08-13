import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { User, Lock, Mail, Phone, MapPin, ArrowRight, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Customer Login & Sign Up | Kadha Sarees" },
      {
        name: "description",
        content: "Sign in or create a Kadha Sarees customer account to save delivery addresses and auto-fill checkout details.",
      },
    ],
  }),
  component: LoginPage,
});

const inputStyle =
  "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-gold";
const labelStyle = "text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-semibold block mb-1.5";

function LoginPage() {
  const { user, login, register, isLoading } = useAuth();
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { redirect?: string };

  const [mode, setMode] = useState<"login" | "register">("login");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // If already logged in, redirect
  if (user) {
    const target = search.redirect || "/account";
    setTimeout(() => navigate({ to: target }), 100);
  }

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await login(email, password);
    if (res.success) {
      setSuccessMsg("Signed in successfully!");
      setTimeout(() => {
        navigate({ to: search.redirect || "/account" });
      }, 500);
    } else {
      setErrorMsg(res.error || "Invalid email or password");
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const address = (formData.get("address") as string) || undefined;
    const password = (formData.get("password") as string) || undefined;

    const res = await register({ name, email, phone, address, password });
    if (res.success) {
      setSuccessMsg("Account created successfully!");
      setTimeout(() => {
        navigate({ to: search.redirect || "/account" });
      }, 500);
    } else {
      setErrorMsg(res.error || "Failed to create account");
    }
  };

  return (
    <div className="mx-auto max-w-md px-6 py-16 sm:py-24">
      <div className="text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">Kadha Sarees Account</p>
        <h1 className="mt-2 font-display text-4xl text-brand-soft">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="mt-2 text-xs text-muted-foreground">
          {mode === "login"
            ? "Sign in to access your saved delivery addresses and booking history."
            : "Save your delivery details once for fast, effortless saree bookings."}
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="mt-8 flex rounded-full border border-border bg-card p-1.5 shadow-2xs">
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setErrorMsg(null);
          }}
          className={`flex-1 rounded-full py-2.5 text-xs font-semibold uppercase tracking-[0.18em] transition-all cursor-pointer ${
            mode === "login"
              ? "bg-brand text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("register");
            setErrorMsg(null);
          }}
          className={`flex-1 rounded-full py-2.5 text-xs font-semibold uppercase tracking-[0.18em] transition-all cursor-pointer ${
            mode === "register"
              ? "bg-brand text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          New Account
        </button>
      </div>

      {/* Error & Success Messages */}
      {errorMsg && (
        <div className="mt-6 rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-xs font-medium text-red-800 text-center">
          ⚠️ {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="mt-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs font-semibold text-emerald-800 flex items-center justify-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-700" /> {successMsg}
        </div>
      )}

      {/* SIGN IN FORM */}
      {mode === "login" && (
        <form className="mt-8 space-y-5" onSubmit={handleLoginSubmit}>
          <div>
            <label className={labelStyle} htmlFor="login-email">
              Email Address *
            </label>
            <div className="relative">
              <input
                id="login-email"
                name="email"
                type="email"
                required
                placeholder="your.email@example.com"
                className={inputStyle}
              />
            </div>
          </div>

          <div>
            <label className={labelStyle} htmlFor="login-password">
              Password *
            </label>
            <input
              id="login-password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full bg-brand py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground hover:bg-brand-soft shadow-md transition-colors cursor-pointer mt-4"
          >
            {isLoading ? "Signing in..." : "Sign In →"}
          </button>
        </form>
      )}

      {/* NEW ACCOUNT FORM */}
      {mode === "register" && (
        <form className="mt-8 space-y-5" onSubmit={handleRegisterSubmit}>
          <div>
            <label className={labelStyle} htmlFor="reg-name">
              Full Name *
            </label>
            <input id="reg-name" name="name" type="text" required placeholder="Ananya Roy" className={inputStyle} />
          </div>

          <div>
            <label className={labelStyle} htmlFor="reg-email">
              Email Address *
            </label>
            <input
              id="reg-email"
              name="email"
              type="email"
              required
              placeholder="ananya.roy@example.com"
              className={inputStyle}
            />
          </div>

          <div>
            <label className={labelStyle} htmlFor="reg-phone">
              Phone Number *
            </label>
            <input
              id="reg-phone"
              name="phone"
              type="tel"
              required
              placeholder="+91 98765 43210"
              className={inputStyle}
            />
          </div>

          <div>
            <label className={labelStyle} htmlFor="reg-address">
              Delivery Address (Saved for future bookings)
            </label>
            <textarea
              id="reg-address"
              name="address"
              rows={3}
              placeholder="House/Flat No., Street, City, State, Pincode"
              className={inputStyle}
            />
          </div>

          <div>
            <label className={labelStyle} htmlFor="reg-password">
              Password *
            </label>
            <input
              id="reg-password"
              name="password"
              type="password"
              required
              placeholder="Minimum 6 characters"
              className={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full bg-brand py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground hover:bg-brand-soft shadow-md transition-colors cursor-pointer mt-4"
          >
            {isLoading ? "Creating Account..." : "Create Account & Save Address →"}
          </button>
        </form>
      )}

      <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
        <Link to="/booking" className="hover:text-brand font-medium underline">
          Continue to Booking as Guest →
        </Link>
      </div>
    </div>
  );
}
