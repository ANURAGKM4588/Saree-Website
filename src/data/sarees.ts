export type SareeView = { url: string; label: string };

export type BlouseAvailability = "both" | "with_only" | "without_only" | "none";

export type Saree = {
  slug: string;
  name: string;
  weave: string;
  colour: string;
  price: number;
  originalPrice?: number;
  image: string;
  views: SareeView[];
  blurb: string;
  fabric: string;
  blouse: string;
  care: string;
  blouseAvailability?: BlouseAvailability;
  withoutBlouseDiscount?: number;
};


const views = (flat: string, model: string, detail: string): SareeView[] => [
  { url: flat, label: "Full drape" },
  { url: model, label: "On the model" },
  { url: detail, label: "Weave detail" },
];

export const sarees: Saree[] = [];

export const weaves = ["Kanjivaram", "Banarasi", "Chanderi", "Chettinad", "Ikat", "Cotton"];

export const getSaree = (slug: string): Saree | undefined => {
  if (typeof window !== "undefined") {
    try {
      const keys = ["kadha_admin_products_v9", "kadha_admin_products_v8", "kadha_admin_products_v7", "kadha_admin_products_v6", "kadha_admin_products_v5", "kadha_admin_products_v4", "kadha_admin_products_v3", "kadha_admin_products_v2", "kadha_admin_products_v1"];
      for (const key of keys) {
        const raw = localStorage.getItem(key);
        if (raw) {
          const stored: Saree[] = JSON.parse(raw);
          const match = stored.find((s) => s.slug === slug);
          if (match) return match;
        }
      }
    } catch {}
  }
  return sarees.find((s) => s.slug === slug);
};

export const formatPrice = (paise: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise);
