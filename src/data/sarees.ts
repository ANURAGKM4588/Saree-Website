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
];

export const weaves = ["Kanjivaram", "Chettinad", "Ikat", "Cotton"];

export const getSaree = (slug: string) => sarees.find((s) => s.slug === slug);

export const formatPrice = (paise: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise);
