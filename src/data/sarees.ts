export type SareeView = { url: string; label: string };

export type Saree = {
  slug: string;
  name: string;
  weave: string;
  colour: string;
  price: number;
  image: string;
  views: SareeView[];
  blurb: string;
  fabric: string;
  blouse: string;
  care: string;
};

const views = (flat: string, model: string, detail: string): SareeView[] => [
  { url: flat, label: "Full drape" },
  { url: model, label: "On the model" },
  { url: detail, label: "Weave detail" },
];

export const sarees: Saree[] = [
  {
    slug: "turmeric-zari-brocade",
    name: "Turmeric Zari Brocade",
    weave: "Kanjivaram",
    colour: "Turmeric",
    price: 6200,
    image: "/Product/turmeric-zari-brocade.png",
    views: views(
      "/Product/turmeric-zari-brocade.png",
      "/Product/turmeric-zari-brocade-model.png",
      "/Product/turmeric-zari-brocade-detail.png"
    ),
    blurb:
      "Turmeric silk cotton with a deep wine pallu carried by a wide floral zari brocade border.",
    fabric: "Handwoven silk cotton with half-fine zari",
    blouse: "0.8m unstitched blouse piece included",
    care: "Dry clean only. Store wrapped in muslin.",
  },
  {
    slug: "amber-peacock-silk-cotton",
    name: "Amber Peacock Silk Cotton",
    weave: "Kanjivaram",
    colour: "Amber",
    price: 5600,
    image: "/Product/amber-peacock-silk-cotton.png",
    views: views(
      "/Product/amber-peacock-silk-cotton.png",
      "/Product/amber-peacock-silk-cotton-model.png",
      "/Product/amber-peacock-silk-cotton-detail.png"
    ),
    blurb: "Amber checks with a wine border of annam and peacock motifs woven in gold.",
    fabric: "Handwoven silk cotton, korvai border",
    blouse: "0.8m unstitched blouse piece included",
    care: "Dry clean recommended.",
  },
  {
    slug: "mustard-kanchi-cotton",
    name: "Mustard Kanchi Cotton",
    weave: "Kanjivaram",
    colour: "Mustard",
    price: 4800,
    image: "/Product/mustard-kanchi-cotton.png",
    views: views(
      "/Product/mustard-kanchi-cotton.png",
      "/Product/mustard-kanchi-cotton-model.png",
      "/Product/mustard-kanchi-cotton-detail.png"
    ),
    blurb: "Bright mustard zari checks finished with a wine paisley pallu — festive but wearable.",
    fabric: "Handwoven cotton with zari checks",
    blouse: "0.8m unstitched blouse piece included",
    care: "Dry clean for the first wash.",
  },
  {
    slug: "coffee-peacock-chettinad",
    name: "Coffee Peacock Chettinad",
    weave: "Chettinad",
    colour: "Coffee",
    price: 5200,
    image: "/Product/coffee-peacock-chettinad.png",
    views: views(
      "/Product/coffee-peacock-chettinad.png",
      "/Product/coffee-peacock-chettinad-model.png",
      "/Product/coffee-peacock-chettinad-detail.png"
    ),
    blurb: "Deep coffee body with gold windowpane checks and a temple peacock border.",
    fabric: "Chettinad handloom cotton",
    blouse: "0.8m unstitched blouse piece included",
    care: "Gentle hand wash, separately.",
  },
  {
    slug: "kumkum-chettinad-cotton",
    name: "Kumkum Chettinad Cotton",
    weave: "Chettinad",
    colour: "Red",
    price: 3400,
    image: "/Product/kumkum-chettinad-cotton.png",
    views: views(
      "/Product/kumkum-chettinad-cotton.png",
      "/Product/kumkum-chettinad-cotton-model.png",
      "/Product/kumkum-chettinad-cotton-detail.png"
    ),
    blurb: "Kumkum red with fine gold checks and a black pallu of woven annam birds.",
    fabric: "Chettinad handloom cotton",
    blouse: "0.8m unstitched blouse piece included",
    care: "Hand wash cold. Line dry in shade.",
  },
  {
    slug: "ivory-ikat-handloom",
    name: "Ivory Ikat Handloom",
    weave: "Ikat",
    colour: "Ivory",
    price: 2900,
    image: "/Product/ivory-ikat-handloom.png",
    views: views(
      "/Product/ivory-ikat-handloom.png",
      "/Product/ivory-ikat-handloom-model.png",
      "/Product/ivory-ikat-handloom-detail.png"
    ),
    blurb: "Fine striped ivory cotton with a coffee ikat panel and hand-knotted tassels.",
    fabric: "Handwoven cotton, natural dye ikat",
    blouse: "Blouse piece not included",
    care: "Machine wash cold, separately.",
  },
  {
    slug: "olive-ikat-handloom",
    name: "Olive Ikat Handloom",
    weave: "Ikat",
    colour: "Olive",
    price: 3100,
    image: "/Product/olive-ikat-handloom.png",
    views: views(
      "/Product/olive-ikat-handloom.png",
      "/Product/ivory-ikat-handloom-model.png",
      "/Product/olive-ikat-handloom.png"
    ),
    blurb: "Pale olive pleats meeting a dark ikat panel, edged with black and ivory tassels.",
    fabric: "Handwoven cotton, natural dye ikat",
    blouse: "Blouse piece not included",
    care: "Machine wash cold, separately.",
  },
  {
    slug: "sunrise-stripe-cotton",
    name: "Sunrise Stripe Cotton",
    weave: "Cotton",
    colour: "Yellow",
    price: 2200,
    image: "/Product/sunrise-stripe-cotton.png",
    views: views(
      "/Product/sunrise-stripe-cotton.png",
      "/Product/mustard-kanchi-cotton-model.png",
      "/Product/sunrise-stripe-cotton.png"
    ),
    blurb: "Broad yellow and peacock-blue stripes in soft daily-wear cotton, tassel finished.",
    fabric: "Handspun, handwoven cotton",
    blouse: "Blouse piece not included",
    care: "Machine wash cold, separately.",
  },
  {
    slug: "rainbow-check-cotton",
    name: "Rainbow Check Cotton",
    weave: "Cotton",
    colour: "Multicolour",
    price: 2600,
    image: "/Product/rainbow-check-cotton.png",
    views: views(
      "/Product/rainbow-check-cotton.png",
      "/Product/kumkum-chettinad-cotton-model.png",
      "/Product/rainbow-check-cotton.png"
    ),
    blurb:
      "A full spectrum of hand-dyed checks in featherlight cotton, finished with pom-pom tassels.",
    fabric: "Handspun, handwoven cotton with textured jacquard checks",
    blouse: "Blouse piece not included",
    care: "Machine wash cold, separately.",
  },
  {
    slug: "sungudi-cotton-brown",
    name: "Earth & Copper Sungudi",
    weave: "Cotton",
    colour: "Brown",
    price: 3800,
    image: "/Product/Sungudi cotton brown.png",
    views: views(
      "/Product/Sungudi cotton brown.png",
      "/Product/coffee-peacock-chettinad-model.png",
      "/Product/Sungudi cotton brown.png"
    ),
    blurb: "Deep earth-toned Sungudi cotton with traditional ring-dyed dots and a contrasting copper zari border.",
    fabric: "100% Handloom Sungudi Cotton",
    blouse: "0.8m unstitched blouse piece included",
    care: "Hand wash cold separately.",
  },
  {
    slug: "sungudi-cotton-orange",
    name: "Marigold Sunrise Sungudi",
    weave: "Cotton",
    colour: "Orange",
    price: 4100,
    image: "/Product/Sungudi cotton orange.png",
    views: views(
      "/Product/Sungudi cotton orange.png",
      "/Product/turmeric-zari-brocade-model.png",
      "/Product/Sungudi cotton orange.png"
    ),
    blurb: "Vibrant marigold orange tie-dye Sungudi saree crafted by Madurai weavers with gold zari pallu.",
    fabric: "Handwoven Sungudi Cotton",
    blouse: "0.8m unstitched blouse piece included",
    care: "Dry clean first wash, gentle hand wash thereafter.",
  },
  {
    slug: "sungudi-cotton-red",
    name: "Crimson Temple Sungudi",
    weave: "Chettinad",
    colour: "Red",
    price: 4500,
    image: "/Product/Sungudi cotton red.png",
    views: views(
      "/Product/Sungudi cotton red.png",
      "/Product/kumkum-chettinad-cotton-model.png",
      "/Product/Sungudi cotton red.png"
    ),
    blurb: "Classic crimson red with intricate geometric temple borders hand-crafted using traditional knotting.",
    fabric: "Soft handloom Sungudi cotton",
    blouse: "0.8m unstitched contrast blouse piece included",
    care: "Hand wash in cold water with mild detergent.",
  },
  {
    slug: "sungudi-cotton-yellow",
    name: "Saffron Gold Sungudi",
    weave: "Cotton",
    colour: "Yellow",
    price: 3900,
    image: "/Product/Sungudi cotton yellow.png",
    views: views(
      "/Product/Sungudi cotton yellow.png",
      "/Product/mustard-kanchi-cotton-model.png",
      "/Product/Sungudi cotton yellow.png"
    ),
    blurb: "Bright saffron yellow drape adorned with fine white bandhani dots and a lustrous gold border.",
    fabric: "High-count handloom cotton",
    blouse: "Blouse piece not included",
    care: "Dry clean recommended.",
  },
  {
    slug: "emerald-banarasi-tussar",
    name: "Emerald Banarasi Tussar",
    weave: "Banarasi",
    colour: "Green",
    price: 7800,
    image: "/Product/ChatGPT Image Aug 11, 2026, 12_01_09 AM.png",
    views: views(
      "/Product/ChatGPT Image Aug 11, 2026, 12_01_09 AM.png",
      "/Product/turmeric-zari-brocade-model.png",
      "/Product/ChatGPT Image Aug 11, 2026, 12_01_09 AM.png"
    ),
    blurb: "Rich emerald green raw tussar silk woven in Banaras with intricate kadwa floral zari motifs.",
    fabric: "Pure Handloom Tussar Silk with tested zari",
    blouse: "0.8m unstitched tussar silk blouse included",
    care: "Dry clean only. Store wrapped in cotton cloth.",
  },
  {
    slug: "sapphire-chanderi-silk",
    name: "Sapphire Chanderi Silk",
    weave: "Chanderi",
    colour: "Blue",
    price: 6900,
    image: "/Product/ChatGPT Image Aug 11, 2026, 12_01_20 AM.png",
    views: views(
      "/Product/ChatGPT Image Aug 11, 2026, 12_01_20 AM.png",
      "/Product/amber-peacock-silk-cotton-model.png",
      "/Product/ChatGPT Image Aug 11, 2026, 12_01_20 AM.png"
    ),
    blurb: "Sheer sapphire blue Chanderi silk cotton with gold tissue zari stripes and coin ashrafi bootis.",
    fabric: "Handwoven Chanderi silk cotton",
    blouse: "0.8m unstitched Chanderi blouse piece included",
    care: "Dry clean only.",
  },
  {
    slug: "plum-kanchi-tissue-zari",
    name: "Plum Kanchi Tissue Zari",
    weave: "Kanjivaram",
    colour: "Plum",
    price: 8500,
    image: "/Product/ChatGPT Image Aug 11, 2026, 12_06_24 AM.png",
    views: views(
      "/Product/ChatGPT Image Aug 11, 2026, 12_06_24 AM.png",
      "/Product/turmeric-zari-brocade-model.png",
      "/Product/ChatGPT Image Aug 11, 2026, 12_06_24 AM.png"
    ),
    blurb: "Royal plum silk interwoven with gold tissue thread, featuring Korvai peacocks and traditional temple border.",
    fabric: "Pure Kanchipuram silk with half-fine gold zari",
    blouse: "0.8m unstitched tissue silk blouse piece included",
    care: "Dry clean only.",
  },
  {
    slug: "ruby-banarasi-brocade",
    name: "Ruby Red Banarasi Brocade",
    weave: "Banarasi",
    colour: "Red",
    price: 9200,
    image: "/Product/ChatGPT Image Aug 11, 2026, 12_00_56 AM.png",
    views: views(
      "/Product/ChatGPT Image Aug 11, 2026, 12_00_56 AM.png",
      "/Product/kumkum-chettinad-cotton-model.png",
      "/Product/ChatGPT Image Aug 11, 2026, 12_00_56 AM.png"
    ),
    blurb: "Opulent ruby red Banarasi katan silk woven with full-body gold zari jaal for bridal splendor.",
    fabric: "Pure Katan Silk with gold brocade work",
    blouse: "0.8m unstitched brocade blouse piece included",
    care: "Dry clean only.",
  },
];

export const weaves = ["Kanjivaram", "Banarasi", "Chanderi", "Chettinad", "Ikat", "Cotton"];

export const getSaree = (slug: string): Saree | undefined => {
  if (typeof window !== "undefined") {
    try {
      const keys = ["kadha_admin_products_v4", "kadha_admin_products_v3", "kadha_admin_products_v2", "kadha_admin_products_v1"];
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
