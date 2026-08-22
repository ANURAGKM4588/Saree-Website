import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartLine = { slug: string; qty: number; blouseOption?: "with" | "without" };

type CartValue = {
  lines: CartLine[];
  count: number;
  add: (slug: string, qty?: number, blouseOption?: "with" | "without") => void;
  setQty: (slug: string, qty: number, blouseOption?: "with" | "without") => void;
  remove: (slug: string, blouseOption?: "with" | "without") => void;
  clear: () => void;
};

const KEY = "kadha-bag-v2";
const CartContext = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      // ignore malformed storage
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      // ignore quota errors
    }
  }, [lines]);

  const add = useCallback((slug: string, qty = 1, blouseOption: "with" | "without" = "with") => {
    setLines((prev) => {
      const found = prev.find((l) => l.slug === slug && (l.blouseOption || "with") === blouseOption);
      if (found) {
        return prev.map((l) =>
          l.slug === slug && (l.blouseOption || "with") === blouseOption ? { ...l, qty: l.qty + qty } : l
        );
      }
      return [...prev, { slug, qty, blouseOption }];
    });
  }, []);

  const setQty = useCallback((slug: string, qty: number, blouseOption: "with" | "without" = "with") => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => !(l.slug === slug && (l.blouseOption || "with") === blouseOption))
        : prev.map((l) =>
            l.slug === slug && (l.blouseOption || "with") === blouseOption ? { ...l, qty } : l
          )
    );
  }, []);

  const remove = useCallback((slug: string, blouseOption: "with" | "without" = "with") => {
    setLines((prev) => prev.filter((l) => !(l.slug === slug && (l.blouseOption || "with") === blouseOption)));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo(
    () => ({
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      add,
      setQty,
      remove,
      clear,
    }),
    [lines, add, setQty, remove, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}


export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}