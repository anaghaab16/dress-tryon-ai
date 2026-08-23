import emeraldSlip from "@/assets/shop/emerald-slip.jpg";
import blackBlazerDress from "@/assets/shop/black-blazer-dress.jpg";
import floralMaxi from "@/assets/shop/floral-maxi.jpg";
import redGown from "@/assets/shop/red-gown.jpg";
import anarkaliSet from "@/assets/shop/anarkali-set.jpg";
import banarasiSaree from "@/assets/shop/banarasi-saree.jpg";
import chiffonSaree from "@/assets/shop/chiffon-saree.jpg";
import lehengaCholi from "@/assets/shop/lehenga-choli.jpg";
import kurtaPalazzo from "@/assets/shop/kurta-palazzo.jpg";
import cottonSuit from "@/assets/shop/cotton-suit.jpg";
import wrapDress from "@/assets/shop/wrap-dress.jpg";
import denimShirtDress from "@/assets/shop/denim-shirt-dress.jpg";
import bodyconMidi from "@/assets/shop/bodycon-midi.jpg";
import tieredMaxi from "@/assets/shop/tiered-maxi.jpg";
import blazerTrouserSet from "@/assets/shop/blazer-trouser-set.jpg";
import shirtPencilSkirt from "@/assets/shop/shirt-pencil-skirt.jpg";
import formalJumpsuit from "@/assets/shop/formal-jumpsuit.jpg";
import coordSet from "@/assets/shop/coord-set.jpg";
import teeMomJeans from "@/assets/shop/tee-mom-jeans.jpg";
import athleisureSet from "@/assets/shop/athleisure-set.jpg";

export const CATEGORIES = ["Ethnic", "Western", "Workwear", "Casual", "Evening"] as const;

export type Category = (typeof CATEGORIES)[number];

export type CatalogItem = {
  id: string;
  name: string;
  brand: string;
  /** Price in Indian rupees. */
  price: number;
  category: Category;
  description: string;
  image: string;
};

export const CATALOG: CatalogItem[] = [
  // ── Ethnic ──────────────────────────────────────────────────────────────
  {
    id: "anarkali-set",
    name: "Navy Gold-Embroidered Anarkali Set",
    brand: "Rangrez",
    price: 4299,
    category: "Ethnic",
    description: "Floor-length georgette anarkali with zari motifs and a matching dupatta.",
    image: anarkaliSet,
  },
  {
    id: "banarasi-saree",
    name: "Red Banarasi Silk Saree",
    brand: "Kashi Loom",
    price: 5999,
    category: "Ethnic",
    description: "Art-silk Banarasi weave with a broad gold zari border and blouse piece.",
    image: banarasiSaree,
  },
  {
    id: "chiffon-saree",
    name: "Blush Floral Chiffon Saree",
    brand: "Kashi Loom",
    price: 2499,
    category: "Ethnic",
    description: "Featherlight printed chiffon that drapes easily — a fuss-free day saree.",
    image: chiffonSaree,
  },
  {
    id: "lehenga-choli",
    name: "Teal Embroidered Lehenga Choli",
    brand: "Rangrez",
    price: 7499,
    category: "Ethnic",
    description: "Flared lehenga with thread-work borders, fitted choli and net dupatta.",
    image: lehengaCholi,
  },
  {
    id: "kurta-palazzo",
    name: "Mustard Kurta & Palazzo Set",
    brand: "Chaya",
    price: 1899,
    category: "Ethnic",
    description: "Rayon straight kurta with white palazzos and a cotton dupatta. Everyday ease.",
    image: kurtaPalazzo,
  },
  {
    id: "cotton-suit",
    name: "Indigo Block-Print Cotton Suit",
    brand: "Chaya",
    price: 2299,
    category: "Ethnic",
    description: "Hand-block printed pure cotton kameez — breathable through Indian summers.",
    image: cottonSuit,
  },

  // ── Western ─────────────────────────────────────────────────────────────
  {
    id: "wrap-dress",
    name: "Rose Print Wrap Midi Dress",
    brand: "Rive Sud",
    price: 3299,
    category: "Western",
    description: "Flutter sleeves, a true wrap front and a self-tie waist on soft crepe.",
    image: wrapDress,
  },
  {
    id: "denim-shirt-dress",
    name: "Belted Denim Shirt Dress",
    brand: "North Row",
    price: 2799,
    category: "Western",
    description: "Mid-wash denim with patch pockets and a tan belt to cinch the waist.",
    image: denimShirtDress,
  },
  {
    id: "bodycon-midi",
    name: "Black Ribbed Bodycon Midi",
    brand: "North Row",
    price: 1999,
    category: "Western",
    description: "Stretch rib knit that skims the body — the reliable dinner dress.",
    image: bodyconMidi,
  },
  {
    id: "tiered-maxi",
    name: "White Tiered Cotton Maxi",
    brand: "Rive Sud",
    price: 2599,
    category: "Western",
    description: "Puff sleeves, smocked bodice and airy tiers in breathable cotton.",
    image: tieredMaxi,
  },
  {
    id: "floral-maxi",
    name: "Garden Print Tie-Waist Maxi",
    brand: "Rive Sud",
    price: 3499,
    category: "Western",
    description: "Blouson sleeves, painterly florals and a self-tie waist on airy crepe.",
    image: floralMaxi,
  },

  // ── Workwear ────────────────────────────────────────────────────────────
  {
    id: "blazer-trouser-set",
    name: "Beige Blazer & Trouser Co-ord",
    brand: "Atelier Nord",
    price: 6499,
    category: "Workwear",
    description: "Relaxed single-button blazer with straight-leg trousers in the same twill.",
    image: blazerTrouserSet,
  },
  {
    id: "shirt-pencil-skirt",
    name: "Poplin Shirt & Navy Pencil Skirt",
    brand: "Atelier Nord",
    price: 3199,
    category: "Workwear",
    description: "Crisp cotton poplin shirt paired with a high-waist pencil skirt.",
    image: shirtPencilSkirt,
  },
  {
    id: "formal-jumpsuit",
    name: "Olive Belted Formal Jumpsuit",
    brand: "Atelier Nord",
    price: 4599,
    category: "Workwear",
    description: "Lapel collar, wide legs and a tie belt — one piece, fully put together.",
    image: formalJumpsuit,
  },
  {
    id: "black-blazer-dress",
    name: "Black Tailored Blazer Dress",
    brand: "Atelier Nord",
    price: 5499,
    category: "Workwear",
    description: "Sharp lapels and a nipped waist in structured wool blend. City-ready.",
    image: blackBlazerDress,
  },

  // ── Casual ──────────────────────────────────────────────────────────────
  {
    id: "coord-set",
    name: "Lilac Linen Shirt & Shorts Set",
    brand: "Chaya",
    price: 2199,
    category: "Casual",
    description: "Breezy linen-blend co-ord with a camp collar and easy pull-on shorts.",
    image: coordSet,
  },
  {
    id: "tee-mom-jeans",
    name: "Cotton Tee & High-Rise Mom Jeans",
    brand: "North Row",
    price: 1799,
    category: "Casual",
    description: "Heavyweight white tee with rigid high-rise denim in a classic blue.",
    image: teeMomJeans,
  },
  {
    id: "athleisure-set",
    name: "Charcoal Athleisure Two-Piece",
    brand: "North Row",
    price: 1599,
    category: "Casual",
    description: "Long-sleeve crop with high-rise leggings in a soft brushed knit.",
    image: athleisureSet,
  },

  // ── Evening ─────────────────────────────────────────────────────────────
  {
    id: "emerald-slip",
    name: "Emerald Bias Slip Midi",
    brand: "Maison Mirror Atelier",
    price: 4999,
    category: "Evening",
    description: "Fluid satin cut on the bias, with fine straps and a soft cowl neckline.",
    image: emeraldSlip,
  },
  {
    id: "red-gown",
    name: "Crimson Satin Column Gown",
    brand: "Maison Mirror Atelier",
    price: 8999,
    category: "Evening",
    description: "A floor-sweeping column in liquid satin — made for receptions and long nights.",
    image: redGown,
  },
];

/** Formats a rupee amount the Indian way, e.g. ₹4,999. */
export function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function findCatalogItem(id: string | undefined) {
  return CATALOG.find((item) => item.id === id);
}
