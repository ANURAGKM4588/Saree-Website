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

import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import heroBanner from "@/assets/hero-banner.jpg";

export const sarees: Saree[] = [
  {
    slug: "mulmul-cotton-handblock-drape",
    name: "Pure Mulmul Cotton Floral Handblock Saree",
    weave: "Mulmul Cotton",
    colour: "Pastel Pink & Cream",
    price: 3499,
    originalPrice: 4500,
    image: hero1,
    views: [{ url: hero1, label: "Full drape" }],
    blurb: "Soft, breathable pure Mulmul cotton handblock printed saree crafted by master artisans.",
    fabric: "100% Pure Breathable Mulmul Cotton",
    blouse: "Unstitched matching blouse piece included",
    care: "Gentle hand wash in cold water with mild detergent.",
    blouseAvailability: "both",
    withoutBlouseDiscount: 300,
  },
  {
    slug: "sungudi-cotton-zari-border-saree",
    name: "Traditional Madurai Sungudi Cotton Saree",
    weave: "Sungudi Cotton",
    colour: "Emerald & Gold Zari",
    price: 2999,
    originalPrice: 3999,
    image: hero2,
    views: [{ url: hero2, label: "Full drape" }],
    blurb: "Authentic hand-dyed Madurai Sungudi cotton saree with traditional zari border.",
    fabric: "Pure Handloom Sungudi Cotton",
    blouse: "Attached blouse piece included",
    care: "Dry clean recommended for initial wash.",
    blouseAvailability: "both",
    withoutBlouseDiscount: 250,
  },
  {
    slug: "royal-kanjivaram-zari-brocade-saree",
    name: "Royal Kanjivaram Pure Silk Zari Brocade",
    weave: "Kanjivaram",
    colour: "Deep Crimson & Gold",
    price: 14999,
    originalPrice: 18500,
    image: hero3,
    views: [{ url: hero3, label: "Full drape" }],
    blurb: "Heirloom Kanjivaram pure silk saree woven with real gold zari borders and korvai weave.",
    fabric: "Pure Kanchipuram Mulberry Silk",
    blouse: "Rich brocade unstitched blouse piece included",
    care: "Dry clean only.",
    blouseAvailability: "both",
    withoutBlouseDiscount: 1000,
  },
  {
    slug: "varanasi-banarasi-katan-silk-saree",
    name: "Varanasi Banarasi Katan Silk Brocade",
    weave: "Banarasi",
    colour: "Midnight Blue & Silver",
    price: 12499,
    originalPrice: 15999,
    image: heroBanner,
    views: [{ url: heroBanner, label: "Full drape" }],
    blurb: "Exquisite handwoven Banarasi katan silk saree featuring intricate kadwa zari weaving.",
    fabric: "Pure Banarasi Katan Silk",
    blouse: "Matching silk blouse piece included",
    care: "Dry clean only.",
    blouseAvailability: "both",
    withoutBlouseDiscount: 800,
  },
];

export const weaves = [
  "Mulmul Cotton",
  "Sungudi Cotton",
  "Kanjivaram",
  "Banarasi",
  "Chanderi",
  "Chettinad",
  "Ikat",
  "Tissue Silk",
  "Tussar Silk",
];

export const getSaree = (slug: string): Saree | undefined => {
  if (typeof window !== "undefined") {
    try {
      for (let i = 25; i >= 1; i--) {
        const raw = localStorage.getItem(`kadha_admin_products_v${i}`);
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
