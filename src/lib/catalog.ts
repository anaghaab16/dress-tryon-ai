import emeraldSlip from "@/assets/shop/emerald-slip.jpg";
import blackBlazerDress from "@/assets/shop/black-blazer-dress.jpg";
import floralMaxi from "@/assets/shop/floral-maxi.jpg";
import redGown from "@/assets/shop/red-gown.jpg";

export type CatalogItem = {
  id: string;
  name: string;
  brand: string;
  /** Price in Indian rupees. */
  price: number;
  category: "Evening" | "Day" | "Tailoring";
  description: string;
  image: string;
};

export const CATALOG: CatalogItem[] = [
  {
    id: "emerald-slip",
    name: "Emerald Bias Slip Midi",
    brand: "Maison Mirror Atelier",
    price: 24999,
    category: "Evening",
    description: "Fluid silk-satin cut on the bias, with fine straps and a soft cowl neckline.",
    image: emeraldSlip,
  },
  {
    id: "red-gown",
    name: "Crimson Satin Column Gown",
    brand: "Maison Mirror Atelier",
    price: 36499,
    category: "Evening",
    description: "A floor-sweeping column in liquid satin — made for receptions and long nights.",
    image: redGown,
  },
  {
    id: "floral-maxi",
    name: "Garden Print Tie-Waist Maxi",
    brand: "Rive Sud",
    price: 16999,
    category: "Day",
    description: "Blouson sleeves, painterly florals and a self-tie waist on airy crepe.",
    image: floralMaxi,
  },
  {
    id: "black-blazer-dress",
    name: "Black Tailored Blazer Dress",
    brand: "Atelier Nord",
    price: 29499,
    category: "Tailoring",
    description: "Sharp lapels and a nipped waist in structured wool blend. City-ready.",
    image: blackBlazerDress,
  },
];

/** Formats a rupee amount the Indian way, e.g. ₹24,999. */
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
