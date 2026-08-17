import emeraldSlip from "@/assets/shop/emerald-slip.jpg";
import blackBlazerDress from "@/assets/shop/black-blazer-dress.jpg";
import floralMaxi from "@/assets/shop/floral-maxi.jpg";
import redGown from "@/assets/shop/red-gown.jpg";

export type CatalogItem = {
  id: string;
  name: string;
  brand: string;
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
    price: 289,
    category: "Evening",
    description: "Fluid silk-satin cut on the bias, with fine straps and a soft cowl neckline.",
    image: emeraldSlip,
  },
  {
    id: "red-gown",
    name: "Crimson Satin Column Gown",
    brand: "Maison Mirror Atelier",
    price: 420,
    category: "Evening",
    description: "A floor-sweeping column in liquid satin — made for receptions and long nights.",
    image: redGown,
  },
  {
    id: "floral-maxi",
    name: "Garden Print Tie-Waist Maxi",
    brand: "Rive Sud",
    price: 195,
    category: "Day",
    description: "Blouson sleeves, painterly florals and a self-tie waist on airy crepe.",
    image: floralMaxi,
  },
  {
    id: "black-blazer-dress",
    name: "Black Tailored Blazer Dress",
    brand: "Atelier Nord",
    price: 340,
    category: "Tailoring",
    description: "Sharp lapels and a nipped waist in structured wool blend. City-ready.",
    image: blackBlazerDress,
  },
];

export function findCatalogItem(id: string | undefined) {
  return CATALOG.find((item) => item.id === id);
}
