import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { CATALOG, formatINR } from "@/lib/catalog";
import { SiteHeader } from "@/components/SiteHeader";
import { PageHeading } from "@/components/PageHeading";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop Dresses — Maison Mirror" },
      {
        name: "description",
        content:
          "Browse the Maison Mirror dress edit and see any piece on yourself with an AI try-on before you buy.",
      },
      { property: "og:title", content: "Shop Dresses — Maison Mirror" },
      {
        property: "og:description",
        content: "A curated dress edit you can try on virtually in one tap.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Shop,
});

const FILTERS = ["All", "Evening", "Day", "Tailoring"] as const;

function Shop() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const items = CATALOG.filter((item) => filter === "All" || item.category === filter);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-5 py-14">
        <PageHeading eyebrow="The edit" title="Shop the collection" accentFrom={1} />

        <div className="mt-10 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`border px-4 py-2 text-[10px] tracking-luxe transition-colors ${
                filter === f
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:border-accent hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <motion.article
              key={item.id}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="group flex flex-col"
            >
              <div className="overflow-hidden bg-secondary/50">
                <img
                  src={item.image}
                  alt={`${item.name} by ${item.brand}`}
                  loading="lazy"
                  width={768}
                  height={1024}
                  className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <p className="mt-4 text-[10px] tracking-luxe text-muted-foreground">{item.brand}</p>
              <h2 className="mt-1 font-display text-xl leading-snug">{item.name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              <p className="mt-3 text-sm">{formatINR(item.price)}</p>
              <div className="mt-4 flex flex-col gap-2">
                <Button asChild size="sm" className="rounded-none text-[10px] tracking-luxe">
                  <Link to="/studio" search={{ dress: item.id }}>
                    See me in this <ArrowRight className="ml-2 size-3.5" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-none text-[10px] tracking-luxe"
                >
                  <ShoppingBag className="mr-2 size-3.5" /> Add to bag
                </Button>
              </div>
            </motion.article>
          ))}
        </div>
      </main>
    </div>
  );
}
